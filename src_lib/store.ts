import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Layer, Project, Operation, CanvasSize, BrandKit } from './types'

interface StudioState {
    project: Project | null
    selectedLayerIds: string[]
    isGenerating: boolean
    zoom: number
    
    // Actions
    setProject: (project: Project) => void
    addLayer: (layer: Omit<Layer, 'id'>) => void
    removeLayer: (id: string) => void
    reorderLayer: (id: string, newZ: number) => void
    transformLayer: (id: string, changes: Partial<Layer>) => void
    setSelectedLayers: (ids: string[]) => void
    setZoom: (zoom: number) => void
    
    // History
    undo: () => void
    redo: () => void
}

export const useStudioStore = create<StudioState>()(
    persist(
        (set, get) => ({
            project: null,
            selectedLayerIds: [],
            isGenerating: false,
            zoom: 1,

            setProject: (project) => set({ project }),

            addLayer: (layerData) => {
                const project = get().project
                if (!project) return

                const newLayer: Layer = {
                    ...layerData,
                    id: `layer-${Date.now()}`,
                }

                const newLayers = [...project.layers, newLayer]
                const history = [...project.history.slice(0, project.historyIndex + 1), newLayers]
                
                set({
                    project: {
                        ...project,
                        layers: newLayers,
                        history,
                        historyIndex: history.length - 1,
                        updatedAt: new Date().toISOString()
                    }
                })
            },

            removeLayer: (id) => {
                const project = get().project
                if (!project) return

                const newLayers = project.layers.filter(l => l.id !== id)
                const history = [...project.history.slice(0, project.historyIndex + 1), newLayers]

                set({
                    project: {
                        ...project,
                        layers: newLayers,
                        history,
                        historyIndex: history.length - 1,
                        updatedAt: new Date().toISOString()
                    }
                })
            },

            reorderLayer: (id, newZ) => {
                const project = get().project
                if (!project) return

                const newLayers = project.layers.map(l => 
                    l.id === id ? { ...l, z: newZ } : l
                ).sort((a, b) => a.z - b.z)

                const history = [...project.history.slice(0, project.historyIndex + 1), newLayers]

                set({
                    project: {
                        ...project,
                        layers: newLayers,
                        history,
                        historyIndex: history.length - 1,
                        updatedAt: new Date().toISOString()
                    }
                })
            },

            transformLayer: (id, changes) => {
                const project = get().project
                if (!project) return

                const newLayers = project.layers.map(l => 
                    l.id === id ? { ...l, ...changes } : l
                )

                const history = [...project.history.slice(0, project.historyIndex + 1), newLayers]

                set({
                    project: {
                        ...project,
                        layers: newLayers,
                        history,
                        historyIndex: history.length - 1,
                        updatedAt: new Date().toISOString()
                    }
                })
            },

            setSelectedLayers: (ids) => set({ selectedLayerIds: ids }),
            setZoom: (zoom) => set({ zoom }),

            undo: () => {
                const project = get().project
                if (!project || project.historyIndex <= 0) return

                const newIndex = project.historyIndex - 1
                set({
                    project: {
                        ...project,
                        layers: project.history[newIndex],
                        historyIndex: newIndex,
                    }
                })
            },

            redo: () => {
                const project = get().project
                if (!project || project.historyIndex >= project.history.length - 1) return

                const newIndex = project.historyIndex + 1
                set({
                    project: {
                        ...project,
                        layers: project.history[newIndex],
                        historyIndex: newIndex,
                    }
                })
            }
        }),
        {
            name: 'studio-storage',
            partialize: (state) => ({ project: state.project }),
        }
    )
)
