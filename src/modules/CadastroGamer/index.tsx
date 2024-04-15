import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ToastAndroid
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialIcons";
import Home from "../Home";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import React from "react";

type CadastroScreenNavigationProp = BottomTabNavigationProp<
  RootTabParamList,
  "Cadastro"
>;
type ParamList = {
  Cadastro: {
    userId?: number;
  };
};
const CadastroGamer = () => {
  const [user, setUser] = useState();
  const [primeiroNome, setPrimeiroNome] = useState("");
  const [segundoNome, setSegundoNome] = useState("");
  const [email, setEmail] = useState("");
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [telefone, setTelefone] = useState("");
  const [UF, setUF] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [endereco, setEndereco] = useState(null);
  const navigation = useNavigation<CadastroScreenNavigationProp>();
  const route = useRoute<RouteProp<ParamList, "Cadastro">>();
  const { userId } = route.params;
  const [data, setData] = useState({
    primeiroNome: "",
    segundoNome: "",
    email: "",
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    telefone: "",
    UF: ""
  });

  function showToast(message: string) {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  }

  const fetchDetails = async () => {
    if (userId) {
      console.log("Fetching details for update...");
      setLoading(true);
      try {
        const storedData = await AsyncStorage.getItem(
          `@CadastroGamer:${route.params.userId}`
        );
        if (storedData) {
          const userData = JSON.parse(storedData);
          setData(userData);
          setPrimeiroNome(userData.primeiroNome);
          setSegundoNome(userData.segundoNome);
          setEmail(userData.email);
          setCep(userData.cep);
          setRua(userData.rua);
          setNumero(userData.numero);
          setBairro(userData.bairro);
          setCidade(userData.cidade);
          setTelefone(userData.telefone);
          setUF(userData.UF);
        }
      } catch (error) {
        console.error("Failed to load", error);
      }
      setLoading(false);
    } else {
      console.log("No userId found, setting up for new entry...");
      setData(null);
      setPrimeiroNome("");
      setSegundoNome("");
      setEmail("");
      setCep("");
      setRua("");
      setNumero("");
      setBairro("");
      setCidade("");
      setTelefone("");
      setUF("");
    }
  };

  const buscarCep = async () => {
    if (cep.length < 8) {
      setError("O CEP deve conter 8 dígitos.");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      setEndereco(response.data);
      setRua(response.data.logradouro);
      setBairro(response.data.bairro);
      setCidade(response.data.localidade);
      setUF(response.data.uf);
      setError("");
    } catch (err) {
      setError("Erro ao buscar o CEP. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };
  const cancelarCadastro = () => {
    setPrimeiroNome("");
    setSegundoNome("");
    setEmail("");
    setCep("");
    setTelefone("");
    setRua("");
    setNumero("");
    setBairro("");
    setCidade("");
    setUF("");
    userId == undefined;
    navigation.navigate("Home");
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchDetails();
    }, [])
  );

  const salvarCadastro = async () => {
    if (
      !primeiroNome ||
      !segundoNome ||
      !email ||
      !telefone ||
      !cep ||
      !rua ||
      !numero ||
      !bairro ||
      !cidade ||
      !UF
    ) {
      showToast("Por favor, preencha todos os campos.");
      return;
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
      showToast("Por favor, insira um email válido.");

      return;
    }

    const regexTelefone = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    if (!regexTelefone.test(telefone)) {
      showToast(
        "Por favor, insira um telefone válido. Formato esperado: (XX) XXXXX-XXXX."
      );

      return;
    }

    try {
      if (!route.params?.userId) {
        const novoCadastro = {
          id: Date.now().toString(),
          primeiroNome,
          segundoNome,
          email,
          telefone,
          cep,
          rua,
          numero,
          bairro,
          cidade,
          UF
        };

        const id = Date.now().toString();
        await AsyncStorage.setItem(
          `@CadastroGamer:${id}`,
          JSON.stringify(novoCadastro)
        );
      } else {
        const update = {
          primeiroNome,
          segundoNome,
          email,
          telefone,
          cep,
          rua,
          numero,
          bairro,
          cidade,
          UF
        };
        await AsyncStorage.setItem(
          `@CadastroGamer:${route.params.userId}`,
          JSON.stringify(update)
        );
      }

      setPrimeiroNome("");
      setSegundoNome("");
      setEmail("");
      setTelefone("");
      setCep("");
      setRua("");
      setNumero("");
      setBairro("");
      setCidade("");
      setUF("");

      console.log("Cadastro salvo com sucesso!");
      showToast("Cadastro salvo com sucesso!");

      navigation.navigate("Home");
    } catch (e) {
      console.error("Erro ao salvar o cadastro", e);
      showToast("Erro ao salvar o cadastro. Tente novamente.");
    }
  };

  const handlePhoneChange = (text) => {
    let formatted = text.replace(/\D/g, "");
    formatted = formatted.substring(0, 11);

    const size = formatted.length;

    if (size === 0) formatted = "";
    else if (size < 3) formatted = `(${formatted}`;
    else if (size < 8)
      formatted = `(${formatted.slice(0, 2)}) ${formatted.slice(2)}`;
    else
      formatted = `(${formatted.slice(0, 2)}) ${formatted.slice(
        2,
        7
      )}-${formatted.slice(7, 11)}`;

    setTelefone(formatted);
  };

  // if (loading) return <Text>Loading...</Text>;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TextInput
        style={styles.input}
        placeholder="Primeiro Nome"
        value={primeiroNome}
        onChangeText={(text) => setPrimeiroNome(text)}
        placeholderTextColor={"#969696"}
      />
      <TextInput
        style={styles.input}
        placeholder="Segundo Nome"
        value={segundoNome}
        onChangeText={(text) => setSegundoNome(text)}
        placeholderTextColor={"#969696"}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholderTextColor={"#969696"}
      />

      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={telefone}
        keyboardType="numeric"
        onChangeText={handlePhoneChange}
        placeholderTextColor={"#969696"}
        maxLength={15}
      />

      <View style={styles.buscaCep}>
        <TextInput
          style={styles.inputCep}
          placeholder="Cep"
          value={cep}
          keyboardType="numeric"
          onChangeText={(text) => setCep(text)}
          maxLength={8}
          placeholderTextColor={"#969696"}
        />
        <TouchableOpacity onPress={buscarCep}>
          {loading ? (
            <ActivityIndicator color="#ee0a0a" />
          ) : (
            <MaterialCommunityIcons name="search" size={26} />
          )}
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.erro}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Rua"
        value={rua}
        onChangeText={(text) => setRua(text)}
        placeholderTextColor={"#969696"}
      />
      <TextInput
        style={styles.input}
        placeholder="Número"
        value={numero}
        onChangeText={(text) => setNumero(text)}
        placeholderTextColor={"#969696"}
      />
      <TextInput
        style={styles.input}
        placeholder="Bairro"
        value={bairro}
        onChangeText={(text) => setBairro(text)}
        placeholderTextColor={"#969696"}
      />
      <TextInput
        style={styles.input}
        placeholder="Cidade"
        value={cidade}
        onChangeText={(text) => setCidade(text)}
        placeholderTextColor={"#969696"}
      />
      <TextInput
        style={styles.input}
        placeholder="UF"
        value={UF}
        onChangeText={(text) => setUF(text)}
        placeholderTextColor={"#969696"}
      />

      <View style={styles.botao}>
        <TouchableOpacity
          style={styles.botaoCancelar}
          onPress={cancelarCadastro}
        >
          <Text style={styles.botaoCancelarText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoSalvar} onPress={salvarCadastro}>
          <Text style={styles.botaoSalvarText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#FFF",
    gap: 8,
    paddingTop: Platform.OS === "ios" ? 0 : 50
  },

  input: {
    color: "#555555",
    borderColor: "#969696",
    borderWidth: 1,
    width: "80%",
    height: 40,
    borderRadius: 8,
    fontSize: 18,
    padding: 8
  },
  buscaCep: {
    justifyContent: "space-between",
    flexDirection: "row",
    gap: 45,
    alignItems: "center"
  },
  inputCep: {
    color: "#555555",
    borderColor: "#969696",
    borderWidth: 1,
    width: "60%",
    height: 40,
    borderRadius: 8,
    fontSize: 18,
    padding: 8
  },
  botao: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginTop: 20
  },
  botaoCancelar: {
    backgroundColor: "#fa0202",
    padding: 10,
    borderRadius: 10,
    width: 75,
    alignItems: "center"
  },
  botaoCancelarText: {
    fontSize: 16,
    color: "#ffffff",
    alignItems: "center"
  },
  botaoSalvar: {
    backgroundColor: "#5ac513",
    padding: 10,
    borderRadius: 10,
    width: 75,
    alignItems: "center"
  },
  botaoSalvarText: {
    fontSize: 16,
    color: "#ffffff"
  },
  resultContainer: {
    width: "100%",
    padding: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "gray",
    marginTop: 10
  },
  erro: {
    color: "red"
  }
});

export default CadastroGamer;
