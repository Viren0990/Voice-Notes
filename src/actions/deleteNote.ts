"use server"

import { prisma } from "@/db" 

export const deleteNote = async (noteId: string) => {
  try {
    const deletedNote = await prisma.note.delete({
      where: {
        id: noteId,
      },
    })
    return deletedNote
  } catch (error) {
    console.error("Error deleting note:", error)
    throw error
  }
}
