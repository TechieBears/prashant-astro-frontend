import { StepConnector, stepConnectorClasses, styled } from '@mui/material';
import { X } from 'lucide-react';
import { Dialog } from '@headlessui/react';


export const imageComponet = (row) => (<div className="w-16 h-16">
    <img
        src={row?.profileImage || "https://avatar.iran.liara.run/public"}
        className="object-cover w-full h-full rounded-full bg-slate1"
        alt={row?.profile?.fullName}
    />
</div>
)
export const imageComponet1 = (row) => (<div className="w-16 h-16">
    <img
        src={row?.image || "https://avatar.iran.liara.run/public"}
        className="object-cover w-full h-full rounded-full bg-slate1"
        alt={row?.name}
    />
</div>
)


export const statusBody = (rowData) => <h6 className={`${rowData?.isRejected ? "bg-red-100 text-red-500" : rowData?.isVerified ? "bg-green-100 text-green-500" : "bg-orange-100 text-orange-500"} py-1.5 px-5 text-center rounded-full`}>{rowData?.isRejected ? "Rejected" : rowData?.isVerified ? "Verified" : "Pending"}</h6>
export const paymentBody = (rowData) => <h6 className={`${rowData?.paymentStatus == "pending" ? "bg-orange-100 text-orange-500" : rowData?.paymentStatus == "success" ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"} py-1.5 px-5 text-center rounded-full capitalize`}>{rowData?.paymentStatus}</h6>

export const formatRole = str =>
    str
        ?.replace(/_/g, ' ')
        ?.replace(/([a-z])([A-Z])/g, '$1 $2')
        ?.replace(/\b\w/g, c => c?.toUpperCase())
    + (str?.endsWith('s') ? '' : 's');



export const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderLeftWidth: 1.8,
            height: 80,
            borderColor: '#007bff',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderLeftWidth: 1.8,
            height: 80,
            borderColor: '#007bff',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        borderLeftWidth: 1.8,
        height: 80,
        borderColor: '#cbd5e1',
    },
}));


export const TableTitle = ({ title, toggle }) => {
    return (
        <Dialog.Title
            as="h2"
            className="text-lg text-white w-full bg-primary font-tbLex leading-6  py-5 px-5 relative z-10"
        >

            {title}

            <div className="absolute right-5 top-5">
                <X onClick={() => toggle()} className='text-white   hover:text-slate-200 cursor-pointer' size={30} />
            </div>
        </Dialog.Title>
    )
}



export const configTextEditor = {
    height: 300,
    minHeight: 300,
    maxHeight: 500,
    width: '100%',
    background: '#eff2fa',
    color: '#000',
    defaultFontFamily: "Lexend",
    defaultFontSize: '16px',
    defaultFontColor: '#000',
    defaultBackgroundColor: '#fff',
    defaultTextAlign: 'left',
    defaultListStyle: 'decimal',
    defaultBulletList: 'disc',
    defaultIndent: '0',
    defaultOutdent: '0',
    defaultLineHeight: '1.5',
    defaultLetterSpacing: '0',
    defaultWordSpacing: '0',
    defaultTextTransform: 'none',
    minWidth: '100%',
    maxWidth: '100%',
    theme: 'summer',
    toolbarAdaptive: false,
    toolbarAdaptiveOptions: {
        left: ['bold', 'italic', 'underline', '|', 'ul', 'ol', '|', 'font', 'fontsize', 'paragraph', '|', 'table', 'link', 'image', 'video', '|', 'align', 'undo', 'redo',],
        right: ['bold', 'italic', 'underline', '|', 'ul', 'ol', '|', 'font', 'fontsize', 'paragraph', '|', 'table', 'link', 'image', 'video', '|', 'align', 'undo', 'redo',],
    },
    buttons: ['bold', 'italic', 'underline', '|', 'ul', 'ol', '|', 'font', 'fontsize', 'paragraph', '|', 'table', 'link', 'image', 'video', '|', 'align', 'undo', 'redo',],
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    processPasteHTML: false,
    processPasteFromWord: false,
}
