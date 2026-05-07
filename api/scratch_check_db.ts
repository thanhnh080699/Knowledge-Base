import db from '@adonisjs/lucid/services/db'

async function run() {
  try {
    const count = await db.from('contact_requests').count('* as total')
    console.log('Total contact requests:', count[0].total)
  } catch (error) {
    console.error('DB Error:', error)
  }
}

run()
