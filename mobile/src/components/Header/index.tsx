import React from "react";

import { Text, View, TouchableOpacity } from "react-native";

import LogoSVG from "../../assets/logo.svg";
import { useAuth } from "../../hooks/auth";
import { UserPhoto } from "../UserPhoto";

import { styles } from "./styles";

export function Header() {
  const { user, signOut } = useAuth();
  return (
    <View style={styles.container}>
      <LogoSVG />

      <View style={styles.logoutButton}>
        <TouchableOpacity onPress={signOut}>
          {user && <Text style={styles.logoutText}>Sair</Text>}
        </TouchableOpacity>
        <UserPhoto imageUri={user?.avatar_url} />
      </View>
    </View>
  );
}
