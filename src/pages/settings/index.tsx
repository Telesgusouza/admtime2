"use client";

import styles from "./styles.module.css";

import imgNoUser from "../../../public/images/noUser.webp";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { User, deleteUser, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db, storage } from "../api/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "react-toastify";
import { checkConnected } from "../api/utils";
import Head from "next/head";

interface IDataUser {
  email?: string;
  name?: string;
  photoUser?: string | null;
}

export default function settings() {
  const [toggleForm, setToggleForm] = useState<boolean>(false);

  const [gmail, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [photoInput, setPhotoInput] = useState<null | File>(null);
  const [photoUrl, setPhotoUrl] = useState<null | undefined | string>(
    undefined
  );

  const [btnDisabled, setBtnDisabled] = useState<boolean>(true);

  useEffect(() => {
    getUserData();
    checkConnected();
  }, []);

  function redirect() {
    if (typeof window !== "undefined") {
      window.location.replace("/dashboard");
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement> | null) {
    if (e && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (file && file.type.startsWith("image/")) {
        setPhotoInput(file);

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const imgUrl = reader.result as string;
          setPhotoUrl(imgUrl);
        };
      }
    }
  }

  function backCard() {
    setToggleForm(false);
    getUserData();
  }

  async function getUid() {
    const user = await new Promise<User | null>((result) => {
      onAuthStateChanged(auth, (user) => {
        result(user);
      });
    });

    if (user) {
      return user.uid;
    } else {
      return new Error("Erro ao buscar id do usuario");
    }
  }

  async function getUserData() {
    const uid = await getUid();
    const data = await getDoc(doc(db, `/dataUser/${uid}`));

    setEmail(data.data()?.email);
    setName(data.data()?.name);
    setPhotoUrl(data.data()?.photoUser);

    setBtnDisabled(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setBtnDisabled(true);

    const uid = await getUid();
    const refUser = doc(db, `/dataUser/${uid}`);

    if (name) {
      let data: IDataUser = {
        email: gmail,
        name,
      };

      if (photoInput) {
        const refPhoto = ref(storage, `photoUser/${uid}`);
        await uploadBytes(refPhoto, photoInput);
        const photoURl = await getDownloadURL(refPhoto);

        data["photoUser"] = photoURl;
      } else {
        if (photoUrl) {
          data["photoUser"] = photoUrl;
        } else {
          data["photoUser"] = null;
        }
      }

      setDoc(refUser, data)
        .then(() => {
          toast.success("Editado com sucesso.");
          setBtnDisabled(false);

          setTimeout(() => {
            setToggleForm(false);
          }, 800);
        })
        .catch((err) => {
          console.error("Erro ao atualizar dados ", err);
          toast.error("Erro ao atualizar dados, por favor tente novamente.");
          setBtnDisabled(false);
        });
    }
  }

  async function logOut() {
    signOut(auth).then(() => {
      toast.info("deslogado com sucesso.");
      window.location.replace("/");
    });
  }

  async function userDelete() {
    const confirmDelete = confirm("Realmente deseja deletar conta?");

    if (confirmDelete) {
      const user = auth.currentUser;
      if (user) {
        deleteUser(user)
          .then(() => {
            toast.success("conta deletada com sucesso.");
            window.location.replace("/");
          })
          .catch((err) => {
            console.error(err);
            toast.error("Erro ao deletar conta");
          });
      }
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Settings</title>
      </Head>

      <div className={styles.containerButton}>
        <button onClick={redirect}>Voltar</button>
        <button onClick={logOut}>Deslogar</button>
      </div>

      <main>
        <h1>Suas informações</h1>
        <p>
          <span onClick={() => setToggleForm((p) => !p)}> Edite </span>suas
          informações
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.photo}>
            {toggleForm && (
              <>
                <input
                  type="file"
                  onChange={(e) => handleFile(e)}
                  className={styles.inputPhoto}
                />
              </>
            )}

            <>
              {photoUrl === undefined ? (
                <>
                  <div className={styles.loadingPhoto} />
                </>
              ) : (
                <>
                  {photoUrl === null ? (
                    <>
                      <Image src={imgNoUser} loading="lazy" alt="no user" />
                    </>
                  ) : (
                    <>
                      <img src={photoUrl} loading="lazy" alt="avatar user" />
                    </>
                  )}
                </>
              )}
            </>
          </div>

          <input type="email" value={gmail} disabled />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!toggleForm}
          />

          {toggleForm && (
            <>
              <button type="submit" disabled={btnDisabled}>
                Editar
              </button>
            </>
          )}

          {toggleForm ? (
            <p onClick={() => backCard()}>
              voltar e visualizar suas informações
            </p>
          ) : (
            <>
              <p onClick={() => setToggleForm((p) => !p)}>
                Edite suas informações
              </p>
            </>
          )}
        </form>
      </main>

      <div className={styles.containerButton}>
        <button onClick={userDelete}>Deletar conta</button>
      </div>
    </div>
  );
}
