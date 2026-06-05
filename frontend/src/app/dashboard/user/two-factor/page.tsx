'use client'

import { useState, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { PageLoader } from '@/components/ui/Spinner'
import { ShieldCheck, ShieldOff, Copy, CheckCircle2, AlertTriangle, Key } from 'lucide-react'
import toast from 'react-hot-toast'

type TwoFactorState = 'setup' | 'verify' | 'enabled'

function generateQRSvgUri(secret: string, accountName: string, issuer: string): string {
  const otpUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`
  const qrDatum = otpUrl
  const size = 200
  const cells = 29
  const cellSize = size / (cells + 2)
  const quiet = cellSize

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">`
  svg += `<rect width="${size}" height="${size}" fill="white"/>`

  let data = 0
  let bit = 0
  const getBit = () => {
    let charCode = 0
    if (bit === 0) {
      charCode = qrDatum.charCodeAt(data)
      data++
      bit = 8
    }
    bit--
    return (charCode >> bit) & 1
  }

  const matrix: number[][] = []
  for (let row = 0; row < cells; row++) {
    const rowArr: number[] = []
    matrix[row] = rowArr
    for (let col = 0; col < cells; col++) {
      rowArr[col] = getBit()
    }
  }

  for (let row = 0; row < cells; row++) {
    const rowArr = matrix[row]
    if (!rowArr) continue
    for (let col = 0; col < cells; col++) {
      if (rowArr[col]) {
        const x = quiet + col * cellSize
        const y = quiet + row * cellSize
        svg += `<rect x="${x}" y="${y}" width="${cellSize + 0.5}" height="${cellSize + 0.5}" fill="black"/>`
      }
    }
  }

  svg += '</svg>'
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

export default function TwoFactorPage() {
  const [state, setState] = useState<TwoFactorState>('setup')
  const [isLoading, setIsLoading] = useState(false)
  const [secret] = useState('JBSWY3DPEHPK3PXP')
  const [qrDataUri] = useState(() => generateQRSvgUri('JBSWY3DPEHPK3PXP', 'user@example.com', 'OTPMart'))
  const [verifyToken, setVerifyToken] = useState('')
  const [backupCodes] = useState([
    'ABCD-EFGH-IJKL-MNOP',
    'QRST-UVWX-YZAB-CDEF',
    'GHIJ-KLMN-OPQR-STUV',
    'WXYZ-ABCD-EFGH-IJKL',
    'MNOP-QRST-UVWX-YZAB',
    'CDEF-GHIJ-KLMN-OPQR',
    'STUV-WXYZ-ABCD-EFGH',
    'IJKL-MNOP-QRST-UVWX',
  ])
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleEnable = () => {
    setState('verify')
  }

  const handleVerify = async () => {
    if (!verifyToken || verifyToken.length < 6) {
      toast.error('Please enter a valid 6-digit code')
      return
    }
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setIsLoading(false)
    setState('enabled')
    toast.success('Two-factor authentication enabled')
  }

  const handleDisable = async () => {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setIsLoading(false)
    setState('setup')
    setVerifyToken('')
    toast.success('Two-factor authentication disabled')
  }

  const copyToClipboard = useCallback((code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
    toast.success('Copied to clipboard')
  }, [])

  const copyAllCodes = useCallback(() => {
    navigator.clipboard.writeText(backupCodes.join('\n'))
    toast.success('All backup codes copied')
  }, [backupCodes])

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Two-Factor Authentication</h1>
        <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account</p>
      </div>

      {state === 'enabled' && (
        <Alert variant="success">
          Two-factor authentication is currently enabled. Your account is more secure.
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Authenticator App</CardTitle>
          <CardDescription>
            Use an authenticator app like Google Authenticator or Authy to generate codes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state === 'setup' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <ShieldCheck className="h-10 w-10 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900">Not yet enabled</p>
                  <p className="text-sm text-gray-500">
                    Protect your account with 2FA
                  </p>
                </div>
              </div>
              <Button onClick={handleEnable}>
                <ShieldCheck className="h-4 w-4 mr-2" />
                Enable Two-Factor Authentication
              </Button>
            </div>
          )}

          {state === 'verify' && (
            <div className="space-y-6">
              <Alert variant="info">
                Scan the QR code below with your authenticator app, then enter the verification code.
              </Alert>

              <div className="flex justify-center">
                <img
                  src={qrDataUri}
                  alt="QR Code"
                  className="rounded-lg border p-2"
                  width={200}
                  height={200}
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500 text-center">
                  Or manually enter this key:{' '}
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">{secret}</code>
                </p>
              </div>

              <div className="max-w-xs mx-auto space-y-4">
                <Input
                  label="Verification Code"
                  placeholder="000000"
                  value={verifyToken}
                  onChange={(e) => setVerifyToken(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  maxLength={6}
                />
                <Button className="w-full" onClick={handleVerify} isLoading={isLoading}>
                  <Key className="h-4 w-4 mr-2" />
                  Verify & Enable
                </Button>
              </div>
            </div>
          )}

          {state === 'enabled' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
                <div>
                  <p className="font-medium text-green-800">Two-factor authentication is active</p>
                  <p className="text-sm text-green-600">
                    You will need a verification code from your authenticator app to sign in.
                  </p>
                </div>
              </div>
              <Button variant="danger" onClick={handleDisable}>
                <ShieldOff className="h-4 w-4 mr-2" />
                Disable Two-Factor Authentication
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {(state === 'verify' || state === 'enabled') && (
        <Card>
          <CardHeader>
            <CardTitle>Backup Codes</CardTitle>
            <CardDescription>
              Save these backup codes in a safe place. You can use them to access your account if you lose your device.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {backupCodes.map((code) => (
                  <div
                    key={code}
                    className="flex items-center justify-between bg-gray-50 rounded px-3 py-2 font-mono text-sm"
                  >
                    <span>{code}</span>
                    <button
                      onClick={() => copyToClipboard(code)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {copiedCode === code ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={copyAllCodes}>
                <Copy className="h-4 w-4 mr-2" />
                Copy All Codes
              </Button>
              <Alert variant="warning">
                <AlertTriangle className="h-4 w-4" />
                Each backup code can only be used once. Generate new codes after using them.
              </Alert>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
