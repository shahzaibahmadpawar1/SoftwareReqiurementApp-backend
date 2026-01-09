import { Router, Request, Response } from 'express';
import { db } from '../db/db';
import { requirementUsers, userPageAccess, userFunctionalityAccess } from '../db/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// Get all users for a project
router.get('/project/:projectId', async (req: Request, res: Response) => {
    try {
        const projectId = parseInt(req.params.projectId);
        const users = await db.select().from(requirementUsers).where(eq(requirementUsers.projectId, projectId));
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get single user with access details
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id);
        const user = await db.select().from(requirementUsers).where(eq(requirementUsers.id, userId));

        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get page access
        const pageAccess = await db.select().from(userPageAccess).where(eq(userPageAccess.userId, userId));

        // Get functionality access
        const functionalityAccess = await db.select().from(userFunctionalityAccess).where(eq(userFunctionalityAccess.userId, userId));

        res.json({
            ...user[0],
            pageAccess,
            functionalityAccess,
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Create new user
router.post('/', async (req: Request, res: Response) => {
    try {
        const { projectId, name, description, privileges, pageAccess: pages, functionalityAccess: functionalities } = req.body;

        if (!projectId || !name) {
            return res.status(400).json({ error: 'Project ID and name are required' });
        }

        const newUser = await db.insert(requirementUsers).values({
            projectId: parseInt(projectId),
            name,
            description: description || null,
            privileges: privileges || null,
        }).returning();

        const userId = newUser[0].id;

        // Add page access if provided
        if (pages && Array.isArray(pages)) {
            for (const pageId of pages) {
                await db.insert(userPageAccess).values({
                    userId,
                    pageId: parseInt(pageId),
                    canAccess: true,
                });
            }
        }

        // Add functionality access if provided
        if (functionalities && Array.isArray(functionalities)) {
            for (const functionalityId of functionalities) {
                await db.insert(userFunctionalityAccess).values({
                    userId,
                    functionalityId: parseInt(functionalityId),
                    canAccess: true,
                });
            }
        }

        res.status(201).json(newUser[0]);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Update user
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id);
        const { name, description, privileges, pageAccess: pages, functionalityAccess: functionalities } = req.body;

        const updatedUser = await db.update(requirementUsers)
            .set({
                name,
                description,
                privileges,
                updatedAt: new Date(),
            })
            .where(eq(requirementUsers.id, userId))
            .returning();

        if (updatedUser.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update page access
        if (pages && Array.isArray(pages)) {
            // Delete existing access
            await db.delete(userPageAccess).where(eq(userPageAccess.userId, userId));

            // Add new access
            for (const pageId of pages) {
                await db.insert(userPageAccess).values({
                    userId,
                    pageId: parseInt(pageId),
                    canAccess: true,
                });
            }
        }

        // Update functionality access
        if (functionalities && Array.isArray(functionalities)) {
            // Delete existing access
            await db.delete(userFunctionalityAccess).where(eq(userFunctionalityAccess.userId, userId));

            // Add new access
            for (const functionalityId of functionalities) {
                await db.insert(userFunctionalityAccess).values({
                    userId,
                    functionalityId: parseInt(functionalityId),
                    canAccess: true,
                });
            }
        }

        res.json(updatedUser[0]);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Delete user
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id);

        const deleted = await db.delete(requirementUsers)
            .where(eq(requirementUsers.id, userId))
            .returning();

        if (deleted.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

export default router;
