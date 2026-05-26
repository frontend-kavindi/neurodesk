"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { UserPlus, Building2, Users, Crown, Shield, User } from "lucide-react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { Badge } from "@/components/ui/badge"

const ROLE_ICONS = { owner: Crown, admin: Shield, member: User }
const ROLE_BADGES = { owner: "warning" as const, admin: "info" as const, member: "default" as const }

export function WorkspacePanel() {
  const { workspaces, activeWorkspace, inviteMember, createWorkspace } = useWorkspaceStore()
  const [inviteOpen, setInviteOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [wsName, setWsName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleInvite = async () => {
    if (!email.trim()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    inviteMember(email.trim())
    setEmail("")
    setLoading(false)
    setInviteOpen(false)
  }

  const handleCreate = async () => {
    if (!wsName.trim()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    createWorkspace(wsName.trim())
    setWsName("")
    setLoading(false)
    setCreateOpen(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-zinc-100">Workspace</h2>
          <p className="text-sm text-zinc-500 mt-0.5">Manage your team and workspace settings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setCreateOpen(true)}>
            <Building2 className="h-3.5 w-3.5" />New Workspace
          </Button>
          <Button size="sm" onClick={() => setInviteOpen(true)}>
            <UserPlus className="h-3.5 w-3.5" />Invite Member
          </Button>
        </div>
      </div>

      {/* Active workspace */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-600/20 border border-violet-600/20 flex items-center justify-center text-lg font-bold text-violet-400">
              {activeWorkspace.name[0]}
            </div>
            <div>
              <CardTitle className="text-base">{activeWorkspace.name}</CardTitle>
              <p className="text-xs text-zinc-500 mt-0.5">{activeWorkspace.slug}.neurodesk.ai</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <Users className="h-4 w-4" />
              <span>{activeWorkspace.members.length} members</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members */}
      <Card>
        <CardHeader>
          <CardTitle>Members ({activeWorkspace.members.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {activeWorkspace.members.map((member, i) => {
            const RoleIcon = ROLE_ICONS[member.role]
            return (
              <motion.div key={member.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-white/4 transition-colors group">
                <div className="h-8 w-8 rounded-full bg-violet-600/30 flex items-center justify-center text-xs font-bold text-violet-300 shrink-0">
                  {member.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">{member.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{member.email}</p>
                </div>
                <Badge variant={ROLE_BADGES[member.role]} className="capitalize">
                  <RoleIcon className="h-3 w-3 mr-1" />
                  {member.role}
                </Badge>
              </motion.div>
            )
          })}
        </CardContent>
      </Card>

      {/* All workspaces */}
      <Card>
        <CardHeader><CardTitle>All Workspaces ({workspaces.length})</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {workspaces.map((ws, i) => (
            <motion.div key={ws.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-white/4 transition-colors">
              <div className="h-8 w-8 rounded-lg bg-zinc-800 border border-white/8 flex items-center justify-center text-sm font-bold text-zinc-400">
                {ws.name[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-200">{ws.name}</p>
                <p className="text-xs text-zinc-500">{ws.members.length} members</p>
              </div>
              {ws.id === activeWorkspace.id && <Badge variant="success">Active</Badge>}
            </motion.div>
          ))}
        </CardContent>
      </Card>

      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite Member">
        <div className="space-y-4">
          <Input label="Email address" type="email" placeholder="colleague@company.com"
            value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleInvite()} />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button onClick={handleInvite} loading={loading} disabled={!email.trim()}>Send Invite</Button>
          </div>
        </div>
      </Modal>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Workspace">
        <div className="space-y-4">
          <Input label="Workspace name" placeholder="e.g. Product Team"
            value={wsName} onChange={e => setWsName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleCreate()} />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} loading={loading} disabled={!wsName.trim()}>Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
