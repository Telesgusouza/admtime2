"use client";
import { useEffect, useState } from "react";

import Head from "next/head";

import imgNoUser from "../../public/images/noUser.webp";

import imgPasswordNot from "../../public/images/icon-passwordnot.svg";
import imgPassword from "../../public/images/icon-password.svg";
import Image from "next/image";
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import styles from "@/styles/Home.module.css";
import { toast } from "react-toastify";
import { auth, db, storage } from "./api/firebase";

export default function Home() {
  const [filePhoto, setFilePhoto] = useState<null | File>(null);
  const [avatar, setAvatar] = useState<null | string>(null);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);

  const [toggleForm, setToggleForm] = useState<boolean>(false);
  const [togglePassword, setTogglePassword] = useState<boolean>(false);

  useEffect(() => {
    async function getUserOn() {
      const user = await new Promise<User | null>((result) => {
        onAuthStateChanged(auth, (user) => {
          result(user);
        });
      });

      if (user?.uid) {
        if (typeof window !== "undefined") {
          window.location.replace("/dashboard");
        }
      }
    }

    getUserOn();
  }, []);

  function handleToggleForm() {
    setToggleForm((p) => !p);
  }

  function handleVisiblePassword() {
    setTogglePassword((p) => !p);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement> | null) {
    if (e && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFilePhoto(file);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const imgUrl = reader.result as string;
        setAvatar(imgUrl);
      };
    }
  }

  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    if (toggleForm) {
      if (name && email && password) {
        if (password.length >= 6) {
          try {
            const createUser = await createUserWithEmailAndPassword(
              auth,
              email,
              password
            );

            const uid = createUser.user.uid;

            let photoUser;

            if (filePhoto) {

              const refStorage = ref(storage, `photoUser/${uid}`);
              await uploadBytes(refStorage, filePhoto);

              await getDownloadURL(refStorage).then((photoUrl) => {
                photoUser = photoUrl;
              });
            }


            await setDoc(doc(db, `dataUser/${uid}`), {
              photoUser: photoUser ? photoUser : null,
              name,
              email,
            }).then(() => {
              toast.success("Conta criada com sucesso!");
              setBtnDisabled(false);
              if (typeof window !== "undefined") {
                window.location.replace("/dashboard");
              }
            });
          } catch (err) {
            setBtnDisabled(false);
            toast.error("Erro ao criar conta.");

            setBtnDisabled(true);
          }
        } else {
          toast.error("senha deve ter 6 caracteres ou mais");
        }
      } else {
        toast.error("preencha todos os campos");
      }
    } else {
      setBtnDisabled(true);
      if (email && password) {
        await signInWithEmailAndPassword(auth, email, password)
          .then(() => {
            setBtnDisabled(false);
            if (typeof window !== "undefined") {
              window.location.replace("/dashboard");
            }
          })
          .catch((err) => {
            setBtnDisabled(false);
            console.error("Error >>> ", err);
          });
        setBtnDisabled(false);
      } else {
        toast.error("Preencha todos os campos.");
        setBtnDisabled(false);
      }
    }
  }

  async function handleResetPassword() {
    if (email) {
      toast.info("Sera enviado um email para redefinir a senha.");
      sendPasswordResetEmail(auth, email)
        .then((resp) => {
          toast.success("Email enviado com sucesso.");
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      toast.error("preencha o campo de email.");
    }
  }

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <main className={`${styles.container}`}>
        <div className={styles.containerContent}>
          <form onSubmit={handleSubmit}>
            <div className={styles.info}>
              <h1>faça {toggleForm ? "seu cadastro" : "login no site"}</h1>
              <p>
                Faça login ou registre-se para começar a administrar seu tempo.
              </p>
            </div>

            {toggleForm && (
              <>
                <div className={styles.photo}>
                  <input type="file" onChange={(e) => handleFile(e)} />
                  {avatar ? (
                    <img src={avatar} loading="lazy" alt="avatar user" />
                  ) : (
                    <Image src={imgNoUser} loading="lazy" alt="avatar user" />
                  )}
                </div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Nome"
                />
              </>
            )}
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="E-mail"
            />
            <div className={styles.password}>
              <label htmlFor="password" className={styles.password}>
                <input
                  type={togglePassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="Senha"
                />
                <Image
                  onClick={handleVisiblePassword}
                  src={togglePassword ? imgPasswordNot : imgPassword}
                  loading="lazy"
                  alt="icone password"
                />
              </label>
              <p onClick={handleResetPassword}>esqueceu a senha?</p>
            </div>

            <button type="submit" disabled={btnDisabled}>
              {toggleForm ? "Cadastrar-se" : "Logar"}
            </button>
            <p className={styles.toggleOptionLogin}>
              {toggleForm ? (
                <>
                  Já tem conta?{" "}
                  <strong onClick={handleToggleForm}>entre</strong>
                </>
              ) : (
                <>
                  Ainda não tem conta?{" "}
                  <strong onClick={handleToggleForm}>cadastre-se</strong>
                </>
              )}
            </p>
          </form>
        </div>
      </main>
    </>
  );
}
