import { Router } from 'express';
import { createUserSchema, loginSchema, usersTable } from '../../db/usersSchema.js';
import { validateData } from '../../middlewares/validationMiddleware.js';
import bcrypt from 'bcryptjs';
import { db } from '../../db/index.js';
import { eq } from "drizzle-orm";
import jwt from 'jsonwebtoken';


const router = Router();

router.post('/register', validateData(createUserSchema), async (req, res) => {
    try {
        const data = req.cleanBody;
        data.password = await bcrypt.hash(data.password, 10);


        const [user] = await db.insert(usersTable).values(data).returning();

        // @ts-ignore
        delete user.password; // remove password from response for security reasons

        res.status(201).json({ user });

    } catch (e) {
        res.status(500).send('Something went worng');
    }
});

router.post('/login', validateData(loginSchema), async (req, res) => {
    try {
        const { email, password } = req.cleanBody;     // destructuring email and password from request body

        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));

        if (!user) {
            res.status(401).json({ error: 'Authentication failed.' });      // don't provide too much informations about error 
            return;
        }



        const matched = await bcrypt.compare(password, user.password); // compare the password with the hashed password in the database
        if (!matched) {
            res.status(401).json({ error: 'Authentication failed.' });      // don't provide too much informations about error 
            return;
        }

        // create a jwt token .. after the user is authenticated
        const token = jwt.sign(
            { userId: user.id, role: user.role },
             'your-secret',
              { expiresIn: '30d' }
            );

         // @ts-ignore
        delete user.password; // remove password from response for security reasons    
        res.status(200).json({ token, user });
    } catch (e) {
        res.status(500).send('Something went worng');
    }
})

export default router;