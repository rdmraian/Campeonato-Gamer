import React from "react";
import { View, Text, StyleSheet } from "react-native";

type InfoCardProps = {
  nome: string;
  telefone: string;
  endereco: string;
  cidade: string;
};

const InfoCard: React.FC<InfoCardProps> = ({
  nome,
  telefone,
  endereco,
  cidade
}) => {
  return (
    <View style={styles.campos}>
      <View style={styles.infoContainer1}>
        <View style={styles.camposStyle}>
          <Text style={styles.label}>Nome: </Text>
          <Text style={styles.value}>{nome}</Text>
        </View>
        <View style={styles.camposStyle}>
          <Text style={styles.label}>Telefone: </Text>
          <Text style={styles.value}>
            {telefone.length > 12
              ? `${telefone.substring(0, 12)}...`
              : telefone}
          </Text>
        </View>
      </View>
      <View style={styles.infoContainer2}>
        <View style={styles.camposStyle}>
          <Text style={styles.label}>Endereço: </Text>
          <Text style={styles.value}>
            {endereco.length > 17
              ? `${endereco.substring(0, 16)}...`
              : endereco}
          </Text>
        </View>
        <View style={styles.camposStyle}>
          <Text style={styles.label}>Cidade: </Text>
          <Text style={styles.value}>
            {cidade.length > 17 ? `${cidade.substring(0, 15)}...` : cidade}
          </Text>
        </View>
      </View>
    </View>
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
export default InfoCard;
