import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import InfoCard from "../infoCard";

type ContactInfoProps = {
  userId: number;
  nome: string;
  telefone: string;
  endereco: string;
  cidade: string;
  onCardPress: (userId: number) => void;
};

const CardFeed: React.FC<ContactInfoProps> = ({
  userId,
  nome,
  telefone,
  endereco,
  cidade,
  onCardPress
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onCardPress(userId)}
    >
      <InfoCard
        nome={nome}
        telefone={telefone}
        endereco={endereco}
        cidade={cidade}
      />
      <Icon name="account-circle-outline" size={24} color="#7D40E7" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    elevation: 2,
    minWidth: 338
  },
  infoContainer1: {
    flexDirection: "column"
  },
  infoContainer2: {
    flexDirection: "column"
  },
  label: {
    fontWeight: "bold",
    color: "#4F4F4F",
    marginRight: 4
  },
  value: {
    color: "#333333"
  },
  campos: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    gap: 8
  },
  camposStyle: {
    display: "flex",
    flexDirection: "row"
  }
});

export default CardFeed;
