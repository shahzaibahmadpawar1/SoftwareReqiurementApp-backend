import { Router, Request, Response } from 'express';
import { db } from '../db/db';
import { functionalities } from '../db/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// Get all functionalities for a page
router.get('/page/:pageId', async (req: Request, res: Response) => {
    try {
        const pageId = parseInt(req.params.pageId);
        const allFunctionalities = await db.select().from(functionalities).where(eq(functionalities.pageId, pageId));
        res.json(allFunctionalities);
    } catch (error) {
        console.error('Error fetching functionalities:', error);
        res.status(500).json({ error: 'Failed to fetch functionalities' });
    }
});

// Get single functionality
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const functionalityId = parseInt(req.params.id);
        const functionality = await db.select().from(functionalities).where(eq(functionalities.id, functionalityId));

        if (functionality.length === 0) {
            return res.status(404).json({ error: 'Functionality not found' });
        }

        res.json(functionality[0]);
    } catch (error) {
        console.error('Error fetching functionality:', error);
        res.status(500).json({ error: 'Failed to fetch functionality' });
    }
});

// Create new functionality
router.post('/', async (req: Request, res: Response) => {
    try {
        const { pageId, name, description, type, fields, dataToDisplay } = req.body;

        if (!pageId || !name || !type) {
            return res.status(400).json({ error: 'Page ID, name, and type are required' });
        }

        if (!['button', 'form', 'table'].includes(type)) {
            return res.status(400).json({ error: 'Type must be button, form, or table' });
        }

        const newFunctionality = await db.insert(functionalities).values({
            pageId: parseInt(pageId),
            name,
            description: description || null,
            type,
            fields: fields || null,
            dataToDisplay: dataToDisplay || null,
        }).returning();

        res.status(201).json(newFunctionality[0]);
    } catch (error) {
        console.error('Error creating functionality:', error);
        res.status(500).json({ error: 'Failed to create functionality' });
    }
});

// Update functionality
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const functionalityId = parseInt(req.params.id);
        const { name, description, type, fields, dataToDisplay } = req.body;

        const updatedFunctionality = await db.update(functionalities)
            .set({
                name,
                description,
                type,
                fields,
                dataToDisplay,
                updatedAt: new Date(),
            })
            .where(eq(functionalities.id, functionalityId))
            .returning();

        if (updatedFunctionality.length === 0) {
            return res.status(404).json({ error: 'Functionality not found' });
        }

        res.json(updatedFunctionality[0]);
    } catch (error) {
        console.error('Error updating functionality:', error);
        res.status(500).json({ error: 'Failed to update functionality' });
    }
});

// Delete functionality
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const functionalityId = parseInt(req.params.id);

        const deleted = await db.delete(functionalities)
            .where(eq(functionalities.id, functionalityId))
            .returning();

        if (deleted.length === 0) {
            return res.status(404).json({ error: 'Functionality not found' });
        }

        res.json({ message: 'Functionality deleted successfully' });
    } catch (error) {
        console.error('Error deleting functionality:', error);
        res.status(500).json({ error: 'Failed to delete functionality' });
    }
});

export default router;
