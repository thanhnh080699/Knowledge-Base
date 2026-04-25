import User from '#models/user'

export default async function run() {
  const user = await User.findBy('email', 'admin@gmail.com')
  if (user) {
    user.password = '123456'
    await user.save()
    console.log('Password fixed for admin@gmail.com')
  } else {
    console.log('User not found')
  }
}
