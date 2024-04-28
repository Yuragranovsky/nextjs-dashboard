'use server'
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {z} from 'zod'
import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
const CreateUpdateInvoice = z.object({
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.string()
})
export async function createInvoice(formData: FormData) {
    const {customerId, amount, status} = CreateUpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
      });
      const amountInCents = amount * 100;
      const date = new Date().toISOString().split('T')[0];
      await sql`INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`
      revalidatePath('/dashboard/invoices');
      redirect('/dashboard/invoices');
}
export async function updateInvoice(id: string, formData: FormData) {
    console.log("id in update form:", id);
    const {customerId, amount, status} = CreateUpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
      });
      const amountInCents = amount * 100;
 
      await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
     
      revalidatePath('/dashboard/invoices');
      redirect('/dashboard/invoices');

}
export async function deleteInvoice(id: string, formData: FormData) {
  //  let result:{message: string} = {message: 'invoice deleted'};
 //   try {
        await sql`DELETE FROM invoices WHERE id=${id}`;
        revalidatePath('/dashboard/invoices');
        
    // } catch (error) {
    //     result = {message: 'Data base error. Invoice not deleted'};
    // }
   
   // return result;
}
export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }
  export async function logout() {
    await signOut();
  }