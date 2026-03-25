import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Link } from "react-router-dom";
import styles from "./Register.module.css";
import BarberSpinner from "../../components/BarberSpinner";

const icons = ["✂️","🪒","💈","🪮","✂️","🪒","💈","🪮","✂️"];

const randomStyles = icons.map(() => ({
  left: Math.random() * 100 + "%",
  fontSize: (22 + Math.random() * 30) + "px",
  animationDuration: (12 + Math.random() * 12) + "s",
  animationDelay: (-Math.random() * 20) + "s"
}));

export default function Register(){

  const [form,setForm] = useState({
    name:"",
    phone:"",
    email:"",
    password:"",
    role:"customer"
  });

  const [show,setShow] = useState(false);
  const [loading,setLoading] = useState(false);

  const register = async () => {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password
    });

    if(error){
      alert(error.message);
      setLoading(false);
      return;
    }

    await supabase.from("profiles").insert({
      id: data.user.id,
      name: form.name,
      phone: form.phone,
      role: form.role
    });

    alert("Registered — confirm email if enabled");
    setLoading(false);
  };

  return (
    <div className={styles.wrapper}>

      {/* floating barber tools */}
      <div className={styles.bg}>
        {icons.map((ic,i)=>(
          <span
            key={i}
            className={styles.icon}
            style={randomStyles[i]}
          >
            {ic}
          </span>
        ))}
      </div>

      <div className={styles.card}>

        <div className={styles.title}>Create Account</div>

        <input className={styles.input}
          placeholder="Full Name"
          onChange={e=>setForm({...form,name:e.target.value})}/>

        <input className={styles.input}
          placeholder="Phone"
          onChange={e=>setForm({...form,phone:e.target.value})}/>

        <input className={styles.input}
          placeholder="Email"
          onChange={e=>setForm({...form,email:e.target.value})}/>

        <div className={styles.passRow}>
          <input className={styles.input}
            type={show?"text":"password"}
            placeholder="Password"
            onChange={e=>setForm({...form,password:e.target.value})}/>
          <button className={styles.eye}
            onClick={()=>setShow(!show)} type="button">
            {show?"🙈":"👁️"}
          </button>
        </div>

        <select className={styles.select}
          onChange={e=>setForm({...form,role:e.target.value})}>
          <option value="customer">Customer</option>
          <option value="owner">Shop Owner</option>
        </select>

        {loading
          ? <BarberSpinner text="Sharpening scissors..." />
          : <button className={styles.button}
              onClick={register}>Register</button>
        }

        <div className={styles.footer}>
          Already registered? <Link to="/login">Login</Link>
        </div>

      </div>
    </div>
  );
}
