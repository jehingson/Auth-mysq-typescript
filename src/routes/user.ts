import { UserController } from "../controller/UserController";
import { Router } from "express";
import { checkJwt } from "../middleware/jws";
import { checkRole } from "../middleware/role";
const router = Router();

// CRUD

router.get('/', [checkJwt, checkRole(['admin'])], UserController.getAll);

router.get('/:id', [checkJwt, checkRole(['admin'])], UserController.getById);

router.post('/', [checkJwt, checkRole(['admin'])], UserController.newUser);

router.patch('/:id', [checkJwt, checkRole(['admin'])], UserController.aditUser);

router.delete('/:id', [checkJwt, checkRole(['admin'])], UserController.deleteUser);


export default router;