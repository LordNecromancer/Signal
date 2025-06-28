import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import directionsData from '../data/directions.json';
import foodgroupsData from '../data/foodgroups.json';
import foodsData from '../data/foods.json';
import servingsData from '../data/servings.json';

const screenWidth = Dimensions.get('window').width;

export default function DietScreen({ mainUser, family }) {
  const people = [mainUser, ...(family || [])];

  

  const [selectedPersonIndex, setSelectedPersonIndex] = useState(0);
  const [selectedFoodGroupKey, setSelectedFoodGroupKey] = useState(0);

  const selectedPerson = people[selectedPersonIndex];

  console.log(people)


  const getServingsFor= (person, servingsData) => {
    const ageNum = parseInt(person.age);
    const gender = person.sex.toLowerCase(); // 'male' or 'female'
  
    return servingsData
      .filter(entry => {
        const entryGender = entry.gender.toLowerCase();
        const ageRange = entry.ages.trim();
        const [min, max] = ageRange.includes('+')
          ? [parseInt(ageRange), Infinity]
          : ageRange.split('to').map(a => parseInt(a));
  
        return (
          entryGender === gender &&
          ageNum >= min &&
          ageNum <= max
        );
      })
      .map(entry => ({
        fgid: entry.fgid,
        servings: entry.servings,
      }));
  }

    const getFoodGroups= (servings, foodgroupsData)=>{
    return servings
    .map(diet=>({
      fgid: diet.fgid,
      groups: foodgroupsData
      .filter(entry => {
        return (
          entry.fgid==diet.fgid
        );
      })
        .map(e=> ({
          foodgroup: e.foodgroup,
          fgcat_id: e.fgcat_id,
          fgcat:e.fgcat

        }))
      
    }))
  }

  const getDirections= (userDiet,directionsData) =>{
    return userDiet
    .map( diet =>({
      ...diet,
      directions: directionsData
      .filter(entry => {
        return (
          entry.fgid==diet.fgid
        );
      })
        .map(e=> ({
          directions: e['directional-statement']
        }))
        
      }
    )
  )
  }

  const getFoods=(userDiet, foodsData) =>{
    return userDiet
    .map( diet =>({
      ...diet,
      groups: diet.groups
      .map(group => ({
        ...group,

        foods: foodsData
        .filter(entry => {
          return (
            entry.fgcat_id==group.fgcat_id
          );
        })


      }))
      
        
      }
    )
  )
  }
      

   

  let servings= getServingsFor(mainUser,servingsData)
  let userDiet= getFoodGroups(servings,foodgroupsData)


  userDiet= getDirections(userDiet,directionsData)
  userDiet=getFoods(userDiet,foodsData)

  console.log(getServingsFor(selectedPerson,servingsData))
  


  return (
  <View>
    <View style={{ flex: 1, flexDirection: 'row' }}>
      {/* Left Panel - People */}
      <View style={{ width: screenWidth / 4, backgroundColor: '#f0f0f0', padding: 10 }}>
        {people.map((person, index) => (
          <TouchableOpacity
            key={index}
            style={{
              backgroundColor: index === selectedPersonIndex ? '#cce5ff' : '#fff',
              padding: 10,
              borderRadius: 8,
              marginBottom: 10,
            }}
            onPress={() => setSelectedPersonIndex(index)}
          >
            <Text style={{ fontWeight: 'bold' }}>{person.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Center Panel - Diet Display */}
      <View style={{ flex: 1, backgroundColor: '#fff', padding: 10 }}>
        {/* Food Group Buttons */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 , flexWrap: 'wrap'}}>
          {userDiet.map((diet,index) => (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: selectedFoodGroupKey === index ? '#88cc88' : '#e0e0e0',
                padding: 10,
                borderRadius: 20,
                margin:10
              }}
              onPress={() => setSelectedFoodGroupKey(index)}
            >
              <Text>{diet.groups[0].foodgroup}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>
            Recommended Servings: {getServingsFor(selectedPerson,servingsData)[selectedFoodGroupKey].servings}
          </Text>
          {console.log(selectedFoodGroupKey)}

          {userDiet[selectedFoodGroupKey].directions?.map((dir, i) => (
            <Text key={i} style={{ fontStyle: 'italic', marginBottom: 4 }}>
              - {dir.directions}
            </Text>
          ))}

          {userDiet[selectedFoodGroupKey].groups?.map((group, idx) => (
            <View key={idx} style={{ marginTop: 15 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{group.fgcat}</Text>
              {group.foods?.map((foodItem, i) => (
                <Text key={i} style={{ marginLeft: 10, marginTop:10 }}>
                   {foodItem.food} ({foodItem.srvg_sz})
                </Text>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
    </View>
  );


}
