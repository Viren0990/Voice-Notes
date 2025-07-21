'use server';

import { prisma } from '@/db';

export const saveNoteToDB = async ({
  title,
  content,
  audioUrl,
  tags,
  userId,
}: {
  title: string;
  content: string;
  audioUrl: string;
  tags: string[];
  userId: string;
}) => {
  try {
    const note = await prisma.note.create({
      data: {
        title,
        content,
        audioUrl,
        tags, // ✅ Pass string[] directly
        userId,
      },
    });

    return { success: true, note };
  } catch (error) {
    console.error('Error saving note:', error);
    return { success: false, error: 'Failed to save note' };
  }
};
