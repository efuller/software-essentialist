import express, { Request, Response } from 'express';
import { prisma } from './database';
const cors = require('cors');

import { StudentController } from "./student.controller";
import { errorHandler } from './errorHandler';
import { ClassesController } from "./classes.controller";

const studentController = new StudentController(errorHandler);
const classesController = new ClassesController(errorHandler);

const app = express();
app.use(express.json());
app.use(cors());

const Errors = {
    ValidationError: 'ValidationError',
    StudentNotFound: 'StudentNotFound',
    ClassNotFound: 'ClassNotFound',
    AssignmentNotFound: 'AssignmentNotFound',
    ServerError: 'ServerError',
    ClientError: 'ClientError',
    StudentAlreadyEnrolled: 'StudentAlreadyEnrolled'
  }


export function isMissingKeys (data: any, keysToCheckFor: string[]) {
    for (let key of keysToCheckFor) {
      if (data[key] === undefined) return true;
    } 
    return false;
}

export function parseForResponse(data: unknown) {
    return JSON.parse(JSON.stringify(data));
}

export function isUUID (id: string) {
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
}

// API Endpoints

// POST student created
app.use(studentController.getRouter());
app.use(classesController.getRouter());

// POST assignment created
app.post('/assignments', async (req: Request, res: Response) => {
    try {
        if (isMissingKeys(req.body, ['classId', 'title'])) {
            return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
        }
    
        const { classId, title } = req.body;
    
        const assignment = await prisma.assignment.create({
            data: {
                classId,
                title
            }
        });
    
        res.status(201).json({ error: undefined, data: parseForResponse(assignment), success: true });
    } catch (error) {
        res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
    }
});

// POST student assigned to assignment
app.post('/student-assignments', async (req: Request, res: Response) => {
    try {
        if (isMissingKeys(req.body, ['studentId', 'assignmentId'])) {
            return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
        }
    
        const { studentId, assignmentId, grade } = req.body;
    
        // check if student exists
        const student = await prisma.student.findUnique({
            where: {
                id: studentId
            }
        });
    
        if (!student) {
            return res.status(404).json({ error: Errors.StudentNotFound, data: undefined, success: false });
        }
    
        // check if assignment exists
        const assignment = await prisma.assignment.findUnique({
            where: {
                id: assignmentId
            }
        });
    
        if (!assignment) {
            return res.status(404).json({ error: Errors.AssignmentNotFound, data: undefined, success: false });
        }
    
        const studentAssignment = await prisma.studentAssignment.create({
            data: {
                studentId,
                assignmentId,
            }
        });
    
        res.status(201).json({ error: undefined, data: parseForResponse(studentAssignment), success: true });
    } catch (error) {
        res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
    }

});

// POST student submitted assignment
app.post('/student-assignments/submit', async (req: Request, res: Response) => {
	try {
		if (isMissingKeys(req.body, ['id'])) {
			return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
		}

		const { id } = req.body;
		
		// check if student assignment exists
		const studentAssignment = await prisma.studentAssignment.findUnique({
			where: {
				id
			}
		});

		if (!studentAssignment) {
			return res.status(404).json({ error: Errors.AssignmentNotFound, data: undefined, success: false });
		}

		const studentAssignmentUpdated = await prisma.studentAssignment.update({
			where: {
				id
			},
			data: {
				status: 'submitted'
			}
		});

		res.status(200).json({ error: undefined, data: parseForResponse(studentAssignmentUpdated), success: true });
	} catch (error) {
		res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
	}
});

// POST student assignment graded
app.post('/student-assignments/grade', async (req: Request, res: Response) => {
    try {

        if (isMissingKeys(req.body, ['id', 'grade'])) {
            return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
        }
    
        const { id, grade } = req.body;
    
        // validate grade
        if (!['A', 'B', 'C', 'D'].includes(grade)) {
            return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
        }
        
        // check if student assignment exists
        const studentAssignment = await prisma.studentAssignment.findUnique({
            where: {
                id
            }
        });
    
        if (!studentAssignment) {
            return res.status(404).json({ error: Errors.AssignmentNotFound, data: undefined, success: false });
        }
    
        const studentAssignmentUpdated = await prisma.studentAssignment.update({
            where: {
                id
            },
            data: {
                grade,
            }
        });
    
        res.status(200).json({ error: undefined, data: parseForResponse(studentAssignmentUpdated), success: true });
    } catch (error) {
        res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
    }
});

// GET assignment by id
app.get('/assignments/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if(!isUUID(id)) {
            return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
        }
        const assignment = await prisma.assignment.findUnique({
            include: {
                class: true,
                studentTasks: true
            },
            where: {
                id
            }
        });
    
        if (!assignment) {
            return res.status(404).json({ error: Errors.AssignmentNotFound, data: undefined, success: false });
        }
    
        res.status(200).json({ error: undefined, data: parseForResponse(assignment), success: true });
    } catch (error) {
        res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
    }
});

// GET all assignments for class
app.get('/classes/:id/assignments', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if(!isUUID(id)) {
            return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
        }

        // check if class exists
        const cls = await prisma.class.findUnique({
            where: {
                id
            }
        });

        if (!cls) {
            return res.status(404).json({ error: Errors.ClassNotFound, data: undefined, success: false });
        }

        const assignments = await prisma.assignment.findMany({
            where: {
                classId: id
            },
            include: {
                class: true,
                studentTasks: true
            }
        });
    
        res.status(200).json({ error: undefined, data: parseForResponse(assignments), success: true });
    } catch (error) {
        res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
    }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
