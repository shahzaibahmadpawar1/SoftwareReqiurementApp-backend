import { Router, Request, Response } from 'express';
import { db } from '../db/db';
import { projects } from '../db/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// Get all projects
router.get('/', async (req: Request, res: Response) => {
    try {
        const allProjects = await db.select().from(projects);
        res.json(allProjects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// Get single project
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const projectId = parseInt(req.params.id);
        const project = await db.select().from(projects).where(eq(projects.id, projectId));

        if (project.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json(project[0]);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});

// Create new project
router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Project name is required' });
        }

        const newProject = await db.insert(projects).values({
            name,
            description: description || null,
        }).returning();

        res.status(201).json(newProject[0]);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// Update project
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const projectId = parseInt(req.params.id);
        const { name, description } = req.body;

        const updatedProject = await db.update(projects)
            .set({
                name,
                description,
                updatedAt: new Date(),
            })
            .where(eq(projects.id, projectId))
            .returning();

        if (updatedProject.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json(updatedProject[0]);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
});

// Delete project
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const projectId = parseInt(req.params.id);

        const deleted = await db.delete(projects)
            .where(eq(projects.id, projectId))
            .returning();

        if (deleted.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

export default router;
