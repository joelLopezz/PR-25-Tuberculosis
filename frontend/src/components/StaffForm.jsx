/* eslint-disable no-unused-vars */
// src/components/StaffForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { getAllHospitals } from "../services/hospitalService";
import { useAuth } from "../context/AuthContext";

const StaffForm = ({ initialValues, onSubmit, isEditing = false }) => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createUser, setCreateUser] = useState(false);
  const navigate = useNavigate();
  const { user, isHospitalAdmin } = useAuth();
  
  console.log("StaffForm - Usuario actual:", user);
  
  // Esquema de validación
  const validationSchema = Yup.object({
    first_name: Yup.string()
      .required("El nombre es obligatorio")
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(100, "El nombre no puede tener más de 100 caracteres"),
    last_name: Yup.string()
      .required("El apellido es obligatorio")
      .min(2, "El apellido debe tener al menos 2 caracteres")
      .max(100, "El apellido no puede tener más de 100 caracteres"),
    ci: Yup.string()
      .required("La CI es obligatoria")
      .max(20, "La CI no puede tener más de 20 caracteres"),
    specialty: Yup.string().max(
      100,
      "La especialidad no puede tener más de 100 caracteres"
    ),
    phone: Yup.string().max(
      20,
      "El teléfono no puede tener más de 20 caracteres"
    ),
    address: Yup.string().max(
      255,
      "La dirección no puede tener más de 255 caracteres"
    ),
    hospital_id: Yup.number()
      .required("El hospital es obligatorio")
      .positive("Debe seleccionar un hospital válido"),
    email: Yup.string()
      .email("Ingrese un correo electrónico válido")
      .when("create_user", {
        is: true,
        then: (schema) =>
          schema.required("El email es obligatorio para crear un usuario"),
      }),
    role_id: Yup.number().when("create_user", {
      is: true,
      then: (schema) =>
        schema.required("El rol es obligatorio para crear un usuario"),
    }),
  });

  // Valores por defecto con ajuste para hospital_id
  const getDefaultValues = () => {
    const defaults = {
      first_name: "",
      last_name: "",
      ci: "",
      specialty: "",
      phone: "",
      address: "",
      hospital_id: "",
      create_user: false,
      email: "",
      role_id: "",
    };
    
    // Si el usuario es admin de hospital, prefijar su hospital_id
    if (user?.role === 'hospital_admin' && user?.hospital_id) {
      console.log("Asignando hospital predeterminado:", user.hospital_id);
      defaults.hospital_id = user.hospital_id.toString();
    }
    
    return defaults;
  };

  // Cargar hospitales al montar el componente
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const data = await getAllHospitals();
        setHospitals(data);
      } catch (error) {
        toast.error("Error al cargar hospitales");
      }
    };

    fetchHospitals();
  }, []);

  // Inicializar valor de createUser desde initialValues si existe
  useEffect(() => {
    if (initialValues && initialValues.has_user) {
      setCreateUser(true);
    }
  }, [initialValues]);

  // Manejar envío del formulario
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);

      // Remover create_user de los valores si no es necesario
      const formData = { ...values };
      if (!formData.create_user) {
        delete formData.email;
        delete formData.role_id;
      }

      // Asegurar que para admin de hospital siempre se use su hospital_id
      if (user?.role === 'hospital_admin' && user?.hospital_id) {
        console.log("Asignando hospital_id forzadamente:", user.hospital_id);
        formData.hospital_id = user.hospital_id.toString();
      }

      await onSubmit(formData);

      toast.success(
        `Personal ${isEditing ? "actualizado" : "creado"} correctamente`
      );
      navigate("/personal");
    } catch (error) {
      toast.error(
        error.message ||
          `Error al ${isEditing ? "actualizar" : "crear"} personal`
      );
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  // Obtener valores iniciales, asegurando hospital_id para admin hospital
  const getInitialValues = () => {
    const merged = { ...getDefaultValues(), ...initialValues };
    
    // Si el usuario es admin de hospital, forzar su hospital_id
    if (user?.role === 'hospital_admin' && user?.hospital_id) {
      console.log("Aplicando hospital_id del usuario en initialValues:", user.hospital_id);
      merged.hospital_id = user.hospital_id.toString();
    }
    
    return merged;
  };

  // Comprobar si es admin hospital para deshabilitar selector
  const isAdminHospital = user?.role === 'hospital_admin';
  
  console.log("Es admin de hospital:", isAdminHospital);
  console.log("Hospital ID asignado:", user?.hospital_id);

  // Obtener los valores iniciales calculados para el formulario
  const calculatedInitialValues = getInitialValues();
  console.log("Valores iniciales calculados:", calculatedInitialValues);

  return (
    <Formik
      initialValues={calculatedInitialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <Form className="space-y-6">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-teal-700 to-blue-700">
              <h3 className="text-lg font-medium text-white">
                {isEditing
                  ? "Editar información del personal"
                  : "Registrar nuevo personal"}
              </h3>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div>
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre <span className="text-red-600">*</span>
                  </label>
                  <Field
                    type="text"
                    name="first_name"
                    id="first_name"
                    placeholder="Ingrese el nombre"
                    className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                  <ErrorMessage
                    name="first_name"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                {/* Apellido */}
                <div>
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Apellido <span className="text-red-600">*</span>
                  </label>
                  <Field
                    type="text"
                    name="last_name"
                    id="last_name"
                    placeholder="Ingrese el apellido"
                    className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                  <ErrorMessage
                    name="last_name"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                {/* CI */}
                <div>
                  <label
                    htmlFor="ci"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    CI <span className="text-red-600">*</span>
                  </label>
                  <Field
                    type="text"
                    name="ci"
                    id="ci"
                    placeholder="Ingrese la cédula de identidad"
                    className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                  <ErrorMessage
                    name="ci"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                {/* Especialidad */}
                <div>
                  <label
                    htmlFor="specialty"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Especialidad
                  </label>
                  <Field
                    type="text"
                    name="specialty"
                    id="specialty"
                    placeholder="Ingrese la especialidad"
                    className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                  <ErrorMessage
                    name="specialty"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Teléfono
                  </label>
                  <Field
                    type="text"
                    name="phone"
                    id="phone"
                    placeholder="Ingrese el teléfono"
                    className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                {/* Hospital */}
                <div>
                  <label
                    htmlFor="hospital_id"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Hospital <span className="text-red-600">*</span>
                  </label>
                  
                  <Field
                    as="select"
                    name="hospital_id"
                    id="hospital_id"
                    className={`mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${isAdminHospital ? 'bg-gray-100' : ''}`}
                    disabled={isAdminHospital || isEditing} // Deshabilitar si es admin hospital o en edición
                  >
                    <option value="">Seleccione un hospital</option>
                    {hospitals.map((hospital) => (
                      <option key={hospital.id} value={hospital.id}>
                        {hospital.name}
                      </option>
                    ))}
                  </Field>
                  
                  <ErrorMessage
                    name="hospital_id"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                  
                  {/* Mensaje para admin de hospital */}
                  {isAdminHospital && (
                    <div className="mt-1 text-xs text-blue-600">
                      <div className="flex items-center">
                        <svg
                          className="h-4 w-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        El personal se asignará a su hospital automáticamente.
                      </div>
                    </div>
                  )}
                </div>

                {/* Dirección */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Dirección
                  </label>
                  <Field
                    type="text"
                    name="address"
                    id="address"
                    placeholder="Ingrese la dirección"
                    className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                {/* Opción para crear usuario */}
                <div className="md:col-span-2 pt-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="create_user"
                      name="create_user"
                      checked={createUser}
                      onChange={(e) => {
                        setCreateUser(e.target.checked);
                        setFieldValue("create_user", e.target.checked);
                      }}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      disabled={isEditing && values.has_user}
                    />
                    <label
                      htmlFor="create_user"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {isEditing && values.has_user
                        ? "Este personal ya tiene un usuario asociado"
                        : "Crear cuenta de usuario para este personal"}
                    </label>
                  </div>
                </div>

                {/* Campos adicionales para creación de usuario */}
                {(createUser || (isEditing && values.has_user)) && (
                  <>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Correo electrónico{" "}
                        <span className="text-red-600">*</span>
                      </label>
                      <Field
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Ingrese el correo electrónico"
                        className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="role_id"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Rol <span className="text-red-600">*</span>
                      </label>
                      <Field
                        as="select"
                        name="role_id"
                        id="role_id"
                        className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione un rol</option>
                        <option value="2">Médico</option>
                        <option value="3">Enfermera/o</option>
                        <option value="4">Recepcionista</option>
                      </Field>
                      <ErrorMessage
                        name="role_id"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                      {/* Añadir esta indicación para administradores cuando están editando */}
                      {isEditing && values.has_user && (
                        <div className="mt-1 text-xs text-blue-600">
                          <div className="flex items-center">
                            <svg
                              className="h-4 w-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              ></path>
                            </svg>
                            Como administrador, puede cambiar el rol de este
                            usuario.
                          </div>
                        </div>
                      )}
                    </div>

                    {!isEditing && (
                      <div className="md:col-span-2">
                        <div className="p-4 bg-blue-50 rounded-md">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg
                                className="h-5 w-5 text-blue-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div className="ml-3 flex-1 md:flex md:justify-between">
                              <p className="text-sm text-blue-700">
                                Se generará un nombre de usuario y contraseña
                                automáticamente. Las credenciales se enviarán al
                                correo electrónico proporcionado.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate("/personal")}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Guardando...
                  </span>
                ) : (
                  `${isEditing ? "Actualizar" : "Guardar"}`
                )}
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default StaffForm;