import { Router, Request, Response } from 'express';
import { db } from '../db/db';
import { workflows } from '../db/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// Get all workflows for a project
router.get('/project/:projectId', async (req: Request, res: Response) => {
    try {
        const projectId = parseInt(req.params.projectId);
        const allWorkflows = await db.select().from(workflows).where(eq(workflows.projectId, projectId));
        res.json(allWorkflows);
    } catch (error) {
        console.error('Error fetching workflows:', error);
        res.status(500).json({ error: 'Failed to fetch workflows' });
    }
});

// Get single workflow
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const workflowId = parseInt(req.params.id);
        const workflow = await db.select().from(workflows).where(eq(workflows.id, workflowId));

        if (workflow.length === 0) {
            return res.status(404).json({ error: 'Workflow not found' });
        }

        res.json(workflow[0]);
    } catch (error) {
        console.error('Error fetching workflow:', error);
        res.status(500).json({ error: 'Failed to fetch workflow' });
    }
});

// Create new workflow
router.post('/', async (req: Request, res: Response) => {
    try {
        const { projectId, name, description, flowchartData } = req.body;

        if (!projectId || !name) {
            return res.status(400).json({ error: 'Project ID and name are required' });
        }

        const newWorkflow = await db.insert(workflows).values({
            projectId: parseInt(projectId),
            name,
            description: description || null,
            flowchartData: flowchartData || null,
        }).returning();

        res.status(201).json(newWorkflow[0]);
    } catch (error) {
        console.error('Error creating workflow:', error);
        res.status(500).json({ error: 'Failed to create workflow' });
    }
});

// Update workflow
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const workflowId = parseInt(req.params.id);
        const { name, description, flowchartData } = req.body;

        const updatedWorkflow = await db.update(workflows)
            .set({
                name,
                description,
                flowchartData,
                updatedAt: new Date(),
            })
            .where(eq(workflows.id, workflowId))
            .returning();

        if (updatedWorkflow.length === 0) {
            return res.status(404).json({ error: 'Workflow not found' });
        }

        res.json(updatedWorkflow[0]);
    } catch (error) {
        console.error('Error updating workflow:', error);
        res.status(500).json({ error: 'Failed to update workflow' });
    }
});

// Delete workflow
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const workflowId = parseInt(req.params.id);

        const deleted = await db.delete(workflows)
            .where(eq(workflows.id, workflowId))
            .returning();

        if (deleted.length === 0) {
            return res.status(404).json({ error: 'Workflow not found' });
        }

        res.json({ message: 'Workflow deleted successfully' });
    } catch (error) {
        console.error('Error deleting workflow:', error);
        res.status(500).json({ error: 'Failed to delete workflow' });
    }
});

export default router;
