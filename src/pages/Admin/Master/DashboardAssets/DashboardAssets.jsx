import { useState } from 'react';
import { Tab, TabList, Tabs, TabPanel } from 'react-tabs'
import DashboardBannerPanel from './DashAssetsPanel/DashboardBannerPanel';

const DashboardAssets = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    return (
        <div className="mx-5 mt-2" >
            <Tabs selectedIndex={selectedTab} onSelect={index => setSelectedTab(index)} >
                <TabList className="flex space-x-4 border-b mx-6">
                    <Tab
                        className={`p-3 cursor-pointer font-tbPop font-medium  transitionw ${selectedTab === 0 ? 'text-blue-500 border-b-2  border-primary outline-0' : 'text-gray-500 border-b'
                            }`}
                    >
                        Home Banner
                    </Tab>
                </TabList>
                {/* ================= Store Category component ============== */}
                <TabPanel>
                    <DashboardBannerPanel />
                </TabPanel>
            </Tabs>
        </div>
    )
}

export default DashboardAssets
