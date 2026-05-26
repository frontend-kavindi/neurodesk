"use client"
import { useState } from "react"
import { ChevronDown, Plus, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function WorkspaceSwitcher() {
  const { workspaces, activeWorkspace, switchWorkspace, createWorkspace } = useWorkspaceStore()
  const [open, setOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [creating, setCreating] = useState(false)

  const handleCreate = async () => {
    if (!newName.trim()) return
    setCreating(true)
    await new Promise(r => setTimeout(r, 400))
    createWorkspace(newName.trim())
    setNewName("")
    setCreating(false)
    setModalOpen(false)
  }

  return (
    <>
      <div className="relative">
        <button onClick={() => setOpen(!open)} aria-haspopup="listbox" aria-expanded={open}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/4 px-2.5 py-1 text-xs text-zinc-300 hover:bg-white/8 transition-colors">
          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
          {activeWorkspace.name}
          <ChevronDown className="h-3 w-3 text-zinc-500" aria-hidden="true" />
        </button>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              className="absolute left-0 top-full mt-1 z-50 w-52 rounded-xl border border-white/10 bg-zinc-900 shadow-xl py-1" role="listbox">
              <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">Workspaces</p>
              {workspaces.map(ws => (
                <button key={ws.id} role="option" aria-selected={ws.id === activeWorkspace.id}
                  onClick={() => { switchWorkspace(ws.id); setOpen(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-white/6 hover:text-white transition-colors">
                  <div className="h-6 w-6 rounded-md bg-violet-600/20 flex items-center justify-center text-[10px] font-bold text-violet-400 shrink-0">
                    {ws.name[0]}
                  </div>
                  <span className="flex-1 text-left truncate">{ws.name}</span>
                  {ws.id === activeWorkspace.id && <Check className="h-3.5 w-3.5 text-violet-400 shrink-0" />}
                </button>
              ))}
              <div className="border-t border-white/6 mt-1 pt-1">
                <button onClick={() => { setOpen(false); setModalOpen(true) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:bg-white/6 hover:text-white transition-colors">
                  <Plus className="h-4 w-4" />
                  New workspace
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Workspace">
        <div className="space-y-4">
          <Input label="Workspace name" placeholder="e.g. Product Team" value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleCreate()} />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} loading={creating} disabled={!newName.trim()}>Create</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
