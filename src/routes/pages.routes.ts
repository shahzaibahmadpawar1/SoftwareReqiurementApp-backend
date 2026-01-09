import { Router, Request, Response } from 'express';
import { db } from '../db/db';
import { pages, functionalities } from '../db/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// Get all pages for a project
router.get('/project/:projectId', async (req: Request, res: Response) => {
    try {
        const projectId = parseInt(req.params.projectId);
        const allPages = await db.select().from(pages).where(eq(pages.projectId, projectId));
        res.json(allPages);
    } catch (error) {
        console.error('Error fetching pages:', error);
        res.status(500).json({ error: 'Failed to fetch pages' });
    }
});

// Get single page with functionalities
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const pageId = parseInt(req.params.id);
        const page = await db.select().from(pages).where(eq(pages.id, pageId));

        if (page.length === 0) {
            return res.status(404).json({ error: 'Page not found' });
        }

        // Get functionalities for this page
        const pageFunctionalities = await db.select().from(functionalities).where(eq(functionalities.pageId, pageId));

        res.json({
            ...page[0],
            functionalities: pageFunctionalities,
        });
    } catch (error) {
        console.error('Error fetching page:', error);
        res.status(500).json({ error: 'Failed to fetch page' });
    }
});

// Create new page
router.post('/', async (req: Request, res: Response) => {
    try {
        const { projectId, name, description } = req.body;

        if (!projectId || !name) {
            return res.status(400).json({ error: 'Project ID and name are required' });
        }

        const newPage = await db.insert(pages).values({
            projectId: parseInt(projectId),
            name,
            description: description || null,
        }).returning();

        res.status(201).json(newPage[0]);
    } catch (error) {
        console.error('Error creating page:', error);
        res.status(500).json({ error: 'Failed to create page' });
    }
});

// Update page
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const pageId = parseInt(req.params.id);
        const { name, description } = req.body;

        const updatedPage = await db.update(pages)
            .set({
                name,
                description,
                updatedAt: new Date(),
            })
            .where(eq(pages.id, pageId))
            .returning();

        if (updatedPage.length === 0) {
            return res.status(404).json({ error: 'Page not found' });
        }

        res.json(updatedPage[0]);
    } catch (error) {
        console.error('Error updating page:', error);
        res.status(500).json({ error: 'Failed to update page' });
    }
});

// Delete page
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const pageId = parseInt(req.params.id);

        const deleted = await db.delete(pages)
            .where(eq(pages.id, pageId))
            .returning();

        if (deleted.length === 0) {
            return res.status(404).json({ error: 'Page not found' });
        }

        res.json({ message: 'Page deleted successfully' });
    } catch (error) {
        console.error('Error deleting page:', error);
        res.status(500).json({ error: 'Failed to delete page' });
    }
});

export default router;
