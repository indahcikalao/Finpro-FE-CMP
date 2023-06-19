import { UserIcon, UserPlusIcon } from '@heroicons/react/24/solid'
import { Button, Card, CardBody, CardFooter, Typography } from '@material-tailwind/react'
import React from 'react'
import { Link } from 'react-router-dom'


const CardRole = () => {
  return (
    <div className='flex flex-row gap-3'>
        <Card className="mt-6 w-96">
            <CardBody>
                <div className='flex'>
                <UserPlusIcon className='text-blue-500 w-6 h-6 mr-1' />
                <Typography variant="h5" color="blue-gray" className="mb-2">
                Admin
                </Typography>
                </div>
                <Typography>
                The place is close to Barceloneta Beach and bus stop just 2 min by walk
                and near.
                </Typography>
            </CardBody>
            <CardFooter className="pt-0">
                <Button>Read More</Button>
            </CardFooter>
        </Card>

        <Card className="mt-6 w-96">
            <CardBody>
                <div className='flex'>
                <UserIcon className='text-blue-500 w-5 h-6 mr-1' />
                <Typography variant="h5" color="blue-gray" className="mb-2">
                User
                </Typography>
                </div>
                <Typography>
                The place is close to Barceloneta Beach and bus stop just 2 min by walk
                and near.
                </Typography>
            </CardBody>
            <CardFooter className="pt-0">
                <Button>Read More</Button>
            </CardFooter>
        </Card>
    </div>
  )
}

export default CardRole