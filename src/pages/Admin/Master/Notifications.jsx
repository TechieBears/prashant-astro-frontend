import Table from '../../../components/Table/Table'
import TableHeader from '../../../components/Table/TableHeader'


export default function Notifications() {

    const imageBodyTemp = (row) => {
        return (
            <>
                {
                    row?.image_url !== null ?
                        <div className="h-20 rounded bg-slate-100">
                            <img
                                loading="lazy"
                                src={row?.image_url}
                                alt="image"
                                className="object-cover w-full h-full rounded bg-slate-100"
                            />
                        </div> : "----"
                }

            </>
        )
    }

    const columns = [
        { field: "image", header: "Image", body: imageBodyTemp, style: true },
        { field: 'title', header: 'Title', sortable: true, style: true },
        { field: 'sub_title', header: 'Message', sortable: true, style: true },
        { field: 'notification_for', header: 'Notification For', body: (row) => <h5>User</h5>, sortable: true, style: true },
        { field: 'pincode', header: 'Pincode', body: (row) => <h5>{row?.pincode == 'All' ? row?.pincode : row?.pincode?.join()}</h5>, sortable: true, style: true }
    ];

    return (
        <div className="space-y-5">

            {/* User Table Section */}
            <div className="bg-white rounded-xl m-4 sm:m-5 shadow-sm  p-5 sm:p-7 ">
                <TableHeader title="All Notifications" subtitle={'Recently users notifications will appear here'} />

                <Table data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} columns={columns} paginator={false} />
            </div>
        </div>
    )
}
