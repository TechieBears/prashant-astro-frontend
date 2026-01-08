import React from 'react';

const InvoiceTemplate = React.forwardRef(({ invoice }, ref) => {
    if (!invoice) return null;

    const {
        invoiceNumber,
        date,
        issuedTo,
        items,
        subtotal,
        totalAmount,
        paymentInfo,
    } = invoice;

    const formattedDate = new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    return (
        <div
            ref={ref}
            style={{
                margin: 0,
                padding: '20px',
                fontFamily: 'Arial, Helvetica, sans-serif',
                color: '#333',
                background: '#ffffff',
                width: '210mm', // A4 width
                minHeight: '297mm', // A4 height
                boxSizing: 'border-box'
            }}
        >
            <div style={{ width: '100%' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold' }}>INVOICE</div>
                    <div>
                        <img
                            src="/logo.png"  // ✅ replace with your logo URL
                            alt="Logo"
                            style={{ maxHeight: '60px' }}
                        />
                    </div>
                </div>

                <div style={{ height: '40px' }} />

                {/* Invoice Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* Issued To */}
                    <div style={{ width: '48%' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>
                            ISSUED TO:
                        </div>
                        <div style={{ lineHeight: 1.6 }}>
                            {issuedTo?.name}<br />
                            {issuedTo?.address}<br />
                            {issuedTo?.city}, {issuedTo?.state} - {issuedTo?.postalCode}<br />
                            {issuedTo?.country}
                        </div>
                    </div>

                    {/* Invoice Meta */}
                    <div style={{ width: '48%', textAlign: 'right', lineHeight: 1.6 }}>
                        <strong>INVOICE NO:</strong> {invoiceNumber}<br />
                        <strong>DATE:</strong> {formattedDate}
                    </div>
                </div>

                <div style={{ height: '40px' }} />

                {/* Items Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            {['Description', 'Price', 'QTY', 'TOTAL'].map((h, i) => (
                                <th
                                    key={i}
                                    style={{
                                        border: '1px solid #ddd',
                                        padding: '12px',
                                        background: '#f5f5f5',
                                        textAlign: i === 3 ? 'right' : 'left',
                                    }}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                                    {item.name}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                                    ₹{item.price}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                                    {item.quantity}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>
                                    ₹{item.total}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <div style={{ fontWeight: 'bold' }}>Subtotal</div>
                    <div style={{ textAlign: 'right' }}>
                        ₹{subtotal}
                        <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '5px' }}>
                            Total: ₹{totalAmount}
                        </div>
                    </div>
                </div>

                <div style={{ height: '50px' }} />

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    {/* Payment Info */}
                    <div style={{ width: '60%', lineHeight: 1.6 }}>
                        <strong>PAYMENT INFO:</strong><br />
                        Method: {paymentInfo?.paymentMethod}<br />
                        Status: {paymentInfo?.paymentStatus}<br />
                        Transaction ID: {paymentInfo?.transactionId}
                    </div>

                    {/* Signature */}
                    <div style={{ width: '35%', textAlign: 'right' }}>
                        Authorized Signature<br />
                        <img
                            src="/signature.png" // ✅ replace if needed
                            alt="Signature"
                            style={{ maxHeight: '50px', marginTop: '10px' }}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
});

export default InvoiceTemplate;