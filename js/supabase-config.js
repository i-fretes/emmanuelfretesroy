// js/supabase-config.js
// ============================================================
// CONFIGURACIÓN DE SUPABASE
// ============================================================

const SUPABASE_CONFIG = {
  url: 'https://piuowmkujjcxwgcimekx.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpdW93bWt1ampjeHdnY2ltZWt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzM2NTIsImV4cCI6MjA5ODMwOTY1Mn0.QCH5cXtVkgceZg2Sz3Ux1xiIXJ3H3m4tk4j6JVzwO0M'
};

// Inicializar Supabase
const supabaseClient = supabase.createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
);

// ============================================================
// FUNCIONES DE UTILIDAD
// ============================================================

// --- OBRAS ---

async function obtenerObras() {
  const { data, error } = await supabaseClient
    .from('obras')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error al obtener obras:', error);
    throw error;
  }
  return data;
}

async function obtenerObrasDestacadas() {
  const { data, error } = await supabaseClient
    .from('obras')
    .select('*')
    .eq('destacada', true)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error al obtener obras destacadas:', error);
    throw error;
  }
  return data;
}

async function obtenerObrasPorTecnica(tecnica) {
  let query = supabaseClient
    .from('obras')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (tecnica && tecnica !== 'todos') {
    query = query.ilike('tecnica', `%${tecnica}%`);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error al obtener obras por técnica:', error);
    throw error;
  }
  return data;
}

async function crearObra(obra) {
  const { data, error } = await supabaseClient
    .from('obras')
    .insert([obra])
    .select();
  
  if (error) {
    console.error('Error al crear obra:', error);
    throw error;
  }
  return data[0];
}

async function actualizarObra(id, obra) {
  const { data, error } = await supabaseClient
    .from('obras')
    .update(obra)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error al actualizar obra:', error);
    throw error;
  }
  return data[0];
}

async function eliminarObra(id) {
  const { error } = await supabaseClient
    .from('obras')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error al eliminar obra:', error);
    throw error;
  }
  return true;
}

// --- SUBIR IMÁGENES ---

async function subirImagen(archivo, nombreArchivo) {
  const { data, error } = await supabaseClient
    .storage
    .from('obras')
    .upload(nombreArchivo, archivo, {
      cacheControl: '3600',
      upsert: true
    });
  
  if (error) {
    console.error('Error al subir imagen:', error);
    throw error;
  }
  
  const { data: urlData } = supabaseClient
    .storage
    .from('obras')
    .getPublicUrl(data.path);
  
  return urlData.publicUrl;
}

async function eliminarImagen(nombreArchivo) {
  const { error } = supabaseClient
    .storage
    .from('obras')
    .remove([nombreArchivo]);
  
  if (error) {
    console.error('Error al eliminar imagen:', error);
    throw error;
  }
  return true;
}

// --- MENSAJES ---

async function obtenerMensajes() {
  const { data, error } = await supabaseClient
    .from('mensajes')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error al obtener mensajes:', error);
    throw error;
  }
  return data;
}

async function crearMensaje(mensaje) {
  const { data, error } = await supabaseClient
    .from('mensajes')
    .insert([mensaje])
    .select();
  
  if (error) {
    console.error('Error al crear mensaje:', error);
    throw error;
  }
  return data[0];
}

async function eliminarTodosMensajes() {
  const { error } = await supabaseClient
    .from('mensajes')
    .delete()
    .neq('id', 0);
  
  if (error) {
    console.error('Error al eliminar mensajes:', error);
    throw error;
  }
  return true;
}
