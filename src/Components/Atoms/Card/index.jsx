import { Button, Card, CardBody, CardFooter, Typography } from '@material-tailwind/react'
import React from 'react'
import { Link } from 'react-router-dom'


const CardRole = () => {
  return (
    <div className='flex flex-row gap-3'>
        <Card className='mt-6 w-96'>
            <CardBody>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                    Admin
                </Typography>
                <Typography>
                    This means you can create and delete users as well as edit all the role permission.
                </Typography>
            </CardBody>
            <CardFooter className='pt-0'>
                <Link to="/" className='inline-block text-blue-800'>
                    Edit role
                </Link>
            </CardFooter>
        </Card>

        <Card className='mt-6 w-96'>
            <CardBody>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                    User
                </Typography>
                <Typography>
                    This means you can create and delete users as well as edit all the role permission.
                </Typography>
            </CardBody>
            <CardFooter className='pt-0'>
                <Link to="/" className='inline-block text-blue-800'>
                    Edit role
                </Link>
            </CardFooter>
        </Card>

        <Card className='mt-6 w-96'>
            <CardBody>
                <Typography variant="h5" color="blue-gray" className="mb-2 mr-0">
                    Add Role
                </Typography>
                <Typography>
                    This means you can create and delete users as well as edit all the role permission.
                </Typography>
            </CardBody>
            <CardFooter className='pt-0'>
                <Link to="/" className='inline-block text-blue-800'>
                    Add role
                </Link>
            </CardFooter>
        </Card>
    </div>
  )
}

export default CardRole