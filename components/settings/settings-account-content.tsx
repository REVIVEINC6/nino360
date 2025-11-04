"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { updateAccountSettings, uploadAvatar, deleteAccount } from "@/app/(dashboard)/settings/actions"
import { User, Mail, Phone, Briefcase, Building2, MapPin, Upload, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface SettingsAccountContentProps {
  profile: any
  user: any
}

export function SettingsAccountContent({ profile, user }: SettingsAccountContentProps) {
  const [loading, setLoading] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      await updateAccountSettings(formData)

      toast({
        title: "Success",
        description: "Account settings updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update account settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAvatarLoading(true)

    try {
      const formData = new FormData()
      formData.append("avatar", file)
      await uploadAvatar(formData)

      toast({
        title: "Success",
        description: "Avatar updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload avatar",
        variant: "destructive",
      })
    } finally {
      setAvatarLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount()
      toast({
        title: "Account Deleted",
        description: "Your account has been deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Account Settings
        </h1>
        <p className="text-muted-foreground mt-2">Manage your account information and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-white/50 backdrop-blur-xl border border-white/20">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="p-6 bg-white/50 backdrop-blur-xl border-white/20">
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-500 text-white text-2xl">
                    {profile?.name?.charAt(0) || user?.email?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Label htmlFor="avatar" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity">
                      <Upload className="h-4 w-4" />
                      {avatarLoading ? "Uploading..." : "Upload Photo"}
                    </div>
                  </Label>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={avatarLoading}
                  />
                  <p className="text-sm text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="name" name="name" defaultValue={profile?.name} className="pl-10" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={profile?.email || user?.email}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="phone" name="phone" defaultValue={profile?.phone} className="pl-10" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="title" name="title" defaultValue={profile?.title} className="pl-10" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="department" name="department" defaultValue={profile?.department} className="pl-10" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="location" name="location" defaultValue={profile?.location} className="pl-10" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    defaultValue={profile?.bio}
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-linear-to-r from-blue-500 to-purple-500 text-white"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card className="p-6 bg-white/50 backdrop-blur-xl border-white/20">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Account Information</h3>
                <p className="text-sm text-muted-foreground">View your account details</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-sm font-medium">User ID</span>
                  <span className="text-sm text-muted-foreground">{user?.id}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-sm font-medium">Email</span>
                  <span className="text-sm text-muted-foreground">{user?.email}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-sm font-medium">Account Created</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(user?.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-sm font-medium">Last Sign In</span>
                  <span className="text-sm text-muted-foreground">
                    {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : "Never"}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="danger" className="space-y-6">
          <Card className="p-6 bg-white/50 backdrop-blur-xl border-white/20 border-red-200">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
                <p className="text-sm text-muted-foreground">Irreversible and destructive actions</p>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50/50">
                  <div>
                    <h4 className="font-medium text-red-900">Delete Account</h4>
                    <p className="text-sm text-red-700">Permanently delete your account and all associated data</p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account and remove all your
                          data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
