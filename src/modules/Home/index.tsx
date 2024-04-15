import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
  View,
  ActivityIndicator
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CardFeed from "../../components/cardFeed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation
} from "@react-navigation/native";
import React from "react";
import {
  BottomTabNavigationProp,
  createBottomTabNavigator
} from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator<RootTabParamList>();

const Home = () => {
  const [cadastros, setCadastros] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp<RootTabParamList>>();
  const buscarTodosCadastros = async () => {
    setLoading(true);
    try {
      const keys = await AsyncStorage.getAllKeys();
      const result = await AsyncStorage.multiGet(keys);

      const cadastros = result.map((req) => {
        return JSON.parse(req[1]);
      });

      setCadastros(cadastros.reverse());
      setLoading(false);
      return cadastros;
    } catch (e) {
      setLoading(false);
      console.error("Erro ao buscar todos os cadastros", e);
    }
  };

  const handleCardPress = (id: number) => {
    console.log(id);
    navigation.navigate("Cadastro", { userId: id });
  };

  useFocusEffect(
    React.useCallback(() => {
      buscarTodosCadastros();
    }, [])
  );

  return (
    <ScrollView style={styles.scrollView}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.container}>
          {cadastros.length === 0 && (
            <Text style={{ textAlign: "center" }}>
              Nenhum cadastro encontrado
            </Text>
          )}
          {cadastros.map((cadastro, index) => (
            <CardFeed
              key={index}
              nome={cadastro.primeiroNome}
              telefone={cadastro.telefone}
              endereco={cadastro.rua}
              cidade={cadastro.cidade}
              userId={cadastro.id}
              onCardPress={handleCardPress}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingBottom: 20
  },
  scrollView: {
    width: "100%",
    padding: 10
  }
});

export default Home;
