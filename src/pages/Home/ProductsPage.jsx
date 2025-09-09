 
import React from 'react'
import BackgroundTitle from '../../components/Titles/BackgroundTitle'

const ProductsPage = () => {
    return (
        <div className='bg-slate1'>
            <BackgroundTitle title="Products"
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Products", href: null }
                ]}
                backgroundImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                height="h-72" />
        </div>
    )
}

export default ProductsPage
