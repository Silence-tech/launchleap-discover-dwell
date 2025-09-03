import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { profiles } from '../schema';

export async function getProfile(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    
    const profile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.user_id, userId))
      .limit(1);
    
    if (profile.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.json(profile[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createProfile(req: Request, res: Response) {
  try {
    const { user_id, username, tagline, bio, avatar_url } = req.body;
    
    const newProfile = await db
      .insert(profiles)
      .values({
        user_id,
        username: username || null,
        tagline: tagline || null,
        bio: bio || null,
        avatar_url: avatar_url || null,
      })
      .returning();
    
    res.status(201).json(newProfile[0]);
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const updates = req.body;
    
    const updatedProfile = await db
      .update(profiles)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(profiles.user_id, userId))
      .returning();
    
    if (updatedProfile.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.json(updatedProfile[0]);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}