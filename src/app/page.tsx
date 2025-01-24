import WifiModule from "@/modules/wifi/wifiModule";
import ThemeV1 from "@/themes/v1/page";
import ThemeV2 from "@/themes/v2/page";
import { act } from "react";
import { menuData } from "@/mockdata/menu";
import ThemeV3 from "@/themes/v3/page";


export default function Home() {
  return (
    <>
      <ThemeV3 menuData={menuData} />
      {
        menuData.modules.wifi.active && (<WifiModule wifiData={menuData.modules.wifi} />)
      }

    </>
  )
}
