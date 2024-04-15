import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import CadastroGamer from "./src/modules/CadastroGamer";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialIcons";
import Home from "./src/modules/Home";

export default function App() {
  const Tab = createBottomTabNavigator();
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "tomato"
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray"
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarColor: "white",
            tabBarLabelStyle: { fontSize: 16 },
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            )
          }}
        />
        <Tab.Screen
          name="Cadastro"
          component={CadastroGamer}
          options={{
            title: "Cadastro",
            tabBarColor: "white",
            tabBarLabelStyle: { fontSize: 16 },
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="person-add-alt-1"
                color={color}
                size={26}
              />
            )
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
