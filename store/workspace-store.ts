import { create } from "zustand"
import { persist } from "zustand/middleware"
import { MOCK_WORKSPACES } from "@/lib/mock-data"
import { generateId } from "@/lib/utils"
import type { Workspace } from "@/types"

interface WorkspaceState {
  workspaces: Workspace[]
  activeWorkspace: Workspace
  createWorkspace: (name: string) => void
  switchWorkspace: (id: string) => void
  inviteMember: (email: string) => void
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      workspaces: MOCK_WORKSPACES,
      activeWorkspace: MOCK_WORKSPACES[0],

      createWorkspace: (name: string) => {
        const ws: Workspace = {
          id: `ws-${generateId()}`,
          name,
          slug: name.toLowerCase().replace(/\s+/g, "-"),
          members: [],
          createdAt: new Date().toISOString(),
        }
        set((s) => ({ workspaces: [...s.workspaces, ws], activeWorkspace: ws }))
      },

      switchWorkspace: (id: string) => {
        const ws = get().workspaces.find((w) => w.id === id)
        if (ws) set({ activeWorkspace: ws })
      },

      inviteMember: (email: string) => {
        const newMember = { id: generateId(), name: email.split("@")[0], email, role: "member" as const }
        set((s) => ({
          activeWorkspace: {
            ...s.activeWorkspace,
            members: [...s.activeWorkspace.members, newMember],
          },
        }))
      },
    }),
    { name: "neurodesk-workspace" }
  )
)
