import { Request, Response } from 'express';
import { db } from '../../db/index';
import { productsTable, createProductSchema } from '../../db/productsSchema';
import { eq } from 'drizzle-orm';
import _ from 'lodash';



export async function listProducts(req: Request, res: Response) {
    try{
      const products = await db.select().from(productsTable);
      res.json(products); 

    } catch (e) {
      res.status(500).send(e);
  }
}

  export async function getProductById(req: Request, res: Response) {
    try{
      const { id } = req.params; // Extracting id from request parameters
      const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, Number(id)));

      if (!product) {
         res.status(404).send({message: 'Product not found'});
      } else {
        res.json(product);
      }

    } catch (e) {
      res.status(500).send(e);
  }
  }

  export async function createProduct(req: Request, res: Response) {
    
    try{
      const [product] = await db
      .insert(productsTable)
      .values(req.cleanBody)
      .returning();
      res.status(201).json(product);    //201 code stand for created

    }catch (e) {
      res.status(500).send(e);
  }
}

  export async function updateProduct(req: Request, res: Response) {
    try{
      const id = Number(req.params.id);
      const updatedFields = req.cleanBody;

      const [product] = await db
        .update(productsTable)
        .set(updatedFields)
        .where(eq(productsTable.id, id))
        .returning();

        if (product) {
          res.json(product); // 204 No Content
        } else {
          res.status(404).send({ message: 'Product not found' });
        }
    } catch (e) {
      res.status(500).send(e);
  }
  }

  export async function deleteProduct(req: Request, res: Response) {
    try{
      const id = Number(req.params.id); // Extracting id from request parameters
      const [deletedProduct] = await db
        .delete(productsTable)
        .where(eq(productsTable.id, id))
        .returning();
      if (deletedProduct) {
        res.status(204).send(); // 204 No Content
      } else {
        res.status(404).send({ message: 'Product not found' });
      }
    } catch (e) {
      res.status(500).send(e);
  }
  }