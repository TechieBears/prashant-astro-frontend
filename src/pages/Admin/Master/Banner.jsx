import moment from 'moment';
import Switch from "react-js-switch";
import Table from '../../../components/Table/Table';
import TableHeader from '../../../components/Table/TableHeader';

function Banner() {
    const premiumBody = (row) => (
        <Switch
            value={row?.isPremium}
            disabled={row?.is_registered || !row?.isVerified || !row?.isRejected == false ? true : false}
            onChange={() => handlePremiumChange(row?._id, row?.isPremium)}
            size={50}
            backgroundColor={{ on: "#86d993", off: "#c6c6c6" }}
            borderColor={{ on: "#86d993", off: "#c6c6c6" }}
        />
    )


    // ================= columns of the table ===============

    const imageBodyTemp = (row) => (
        <div className="h-24 rounded bg-slate-100">
            <img
                loading="lazy"
                src={row?.image}
                alt="image"
                className="object-cover w-full h-full rounded bg-slate-100"
            />
        </div>
    );


    const columns = [
        { field: "image", header: "Image", body: imageBodyTemp, style: true },
        { field: 'vendor_type', header: 'Banner For', sortable: true, style: true },
        { field: 'redirection_type', header: 'Redirection Type', body: (row) => <h5>{row?.redirection_type ? row?.redirection_type : row?.redirect_link}</h5>, sortable: true, style: true },
        { field: 'featured_time', header: 'Featured Time', body: (row) => <h6>{row?.start_time != null ? (moment(row?.start_time).format('YYYY-MM-DD ,HH:mm') + " to " + moment(row?.end_time).format('YYYY-MM-DD ,HH:mm')) : '-----'}</h6>, sortable: true, style: true },
        { field: "isactive", header: "Active", body: premiumBody, sortable: true, style: true },
        { field: "", header: premiumBody, sortable: true, style: true },
    ];

    return (
        <div className="space-y-5">
            {/* User Table Section */}
            <div className="bg-white rounded-xl m-4 sm:m-5 shadow-sm  p-5 sm:p-7 ">
                <TableHeader title="All Banners" subtitle="Recently added banners will appear here" />
                <Table data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} columns={columns} paginator={false} />
            </div>
        </div>
    );
}

export default Banner;
