"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Smartphone, Monitor, Tablet, MapPin, Calendar, Shield, Trash2, CheckCircle2, AlertCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Device {
  id: string
  deviceName: string
  deviceType: string
  browser: string
  os: string
  ipAddress: string
  location: string
  lastActive: string
  isTrusted: boolean
  isCurrentDevice: boolean
}

export default function DeviceManagementPage() {
  const [devices, setDevices] = useState<Device[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadDevices()
  }, [])

  const loadDevices = async () => {
    try {
      const response = await fetch("/api/auth/devices")
      const data = await response.json()
      setDevices(data.devices || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load devices",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const trustDevice = async (deviceId: string) => {
    try {
      const response = await fetch(`/api/auth/devices/${deviceId}/trust`, {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Device Trusted",
          description: "This device is now trusted",
        })
        loadDevices()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to trust device",
        variant: "destructive",
      })
    }
  }

  const revokeDevice = async (deviceId: string) => {
    try {
      const response = await fetch(`/api/auth/devices/${deviceId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Device Revoked",
          description: "Device access has been removed",
        })
        loadDevices()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke device",
        variant: "destructive",
      })
    }
  }

  const getDeviceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "mobile":
        return <Smartphone className="h-5 w-5" />
      case "tablet":
        return <Tablet className="h-5 w-5" />
      default:
        return <Monitor className="h-5 w-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Device Management</h1>
              <p className="text-gray-600">Manage devices that have access to your account</p>
            </div>
          </div>
        </div>

        {/* Devices List */}
        <div className="grid gap-4">
          {devices.map((device) => (
            <Card
              key={device.id}
              className={`backdrop-blur-xl bg-white/70 border-white/20 shadow-xl p-6 ${
                device.isCurrentDevice ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600">
                    {getDeviceIcon(device.deviceType)}
                  </div>

                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{device.deviceName}</h3>
                        {device.isCurrentDevice && (
                          <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                            Current Device
                          </span>
                        )}
                        {device.isTrusted && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                      </div>
                      <p className="text-sm text-gray-600">
                        {device.browser} on {device.os}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{device.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <AlertCircle className="h-4 w-4" />
                        <span>{device.ipAddress}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Active {formatDistanceToNow(new Date(device.lastActive), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {!device.isTrusted && !device.isCurrentDevice && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => trustDevice(device.id)}
                      className="border-green-200 text-green-600 hover:bg-green-50"
                    >
                      Trust Device
                    </Button>
                  )}
                  {!device.isCurrentDevice && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => revokeDevice(device.id)}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {devices.length === 0 && !isLoading && (
          <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-xl p-12 text-center">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Devices Found</h3>
            <p className="text-gray-600">Your devices will appear here once you log in</p>
          </Card>
        )}
      </div>
    </div>
  )
}
