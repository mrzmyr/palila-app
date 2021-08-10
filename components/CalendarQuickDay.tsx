import React from "react";
import { Pressable, Text } from "react-native";

export default ({ date, marking, onPress }) => {

  let containerStyles = {};
  if(marking) containerStyles = marking.customStyles.container;

  let textStyles = {};
  if(marking) textStyles = marking.customStyles.text;

  // console.log('CalendarQuickDay render')
  
   return (
     <Pressable 
       onPress={() => onPress(date)}
       style={({ pressed }) => [
         containerStyles, {
           borderRadius: 100, 
           width: 40, 
           flex: 1, 
           marginTop: -8, 
           flexBasis: 40, 
           justifyContent: 'center' 
         },
        //  pressed && new Date() > new Date(date.dateString) ? { backgroundColor: '#EEE' } : {}
       ]}
     >
       <Text style={{ ...textStyles, fontSize: 16, textAlign: 'center', color: new Date() < new Date(date.dateString) ? 'grey' : textStyles.color }}>
         {date.day}
       </Text>
     </Pressable>
   );
 }