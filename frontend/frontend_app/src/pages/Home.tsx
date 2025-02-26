import ChatArea from "@/components/chatArea";
import ChatHeader from "@/components/chatHeader";
import ChatInput from "@/components/chatInput";
import { Menu } from "@/components/menu";
import { Username } from "@/components/username";
import { Grid, GridItem, GridItemProps } from "@chakra-ui/react";
import { RefAttributes } from "react";
import { JSX } from "react/jsx-runtime";

const BorderedGridItem = (props: JSX.IntrinsicAttributes & GridItemProps & RefAttributes<HTMLDivElement>) => {
    return (
      <GridItem
        {...props}
      >
        {props.children}
      </GridItem>
    );
};

export default function Home() {
    return(
        <Grid
            w='wv'
            h='vh'
            templateRows="repeat(11,1fr)"
            templateColumns={["repeat(3,1fr)","repeat(4,1fr)"]}
        >
            <BorderedGridItem
                rowSpan={2} 
                colSpan={1}
                borderWidth="1px"
                borderTop="none"
                borderLeft="none"
                borderColor="lightBrand"
            >
                <Username/> 
            </BorderedGridItem>
            <BorderedGridItem 
                rowSpan={1} 
                colSpan={[2,3]}
                borderWidth="1px"
                borderTop="none"
                borderRight="none"
                borderLeft="none"
                borderColor="lightBrand"
            >
                <ChatHeader/>
            </BorderedGridItem>
            <BorderedGridItem 
                rowSpan={9}
                colSpan={[2,3]}
            >
                <ChatArea/>   
            </BorderedGridItem>
            <BorderedGridItem
                rowSpan={9}
                colSpan={1}
                borderWidth="1px"
                borderTop="none"
                borderBottom="none"
                borderLeft="none"
                borderColor="lightBrand"
            >
                <Menu/> 
            </BorderedGridItem>
            <BorderedGridItem
                rowSpan={1}
                colSpan={[2,3]}
                borderWidth="1px"
                borderLeft="none"
                borderRight="none"
                borderBottom="none"
                borderColor="lightBrand"
            >
                <ChatInput/>
            </BorderedGridItem>
        </Grid>
    )
}