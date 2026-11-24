const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_URL || 'http://localhost:8000';

export { API_BASE_URL, MEDIA_BASE_URL };

export async function loginAdmin(username, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to authenticate');
  }
  return data;
}

export async function fetchProducts(options = {}) {
  const { admin = false, category = '', search = '', deleted = false } = options;
  const params = new URLSearchParams();
  if (admin) params.append('admin', 'true');
  if (deleted) params.append('deleted', 'true');
  if (category) params.append('category', category);
  if (search) params.append('search', search);

  const url = `${API_BASE_URL}/products/?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to load products');
  }
  return response.json();
}

export async function fetchCategories() {
  const response = await fetch(`${API_BASE_URL}/categories/`);
  if (!response.ok) {
    throw new Error('Failed to load categories');
  }
  return response.json();
}

export async function fetchStoreStats() {
  const response = await fetch(`${API_BASE_URL}/stats/`);
  if (!response.ok) {
    throw new Error('Failed to load stats');
  }
  return response.json();
}

export async function createProduct(formData) {
  const response = await fetch(`${API_BASE_URL}/products/`, {
    method: 'POST',
    body: formData, // FormData with image file and text fields
  });
  const data = await response.json();
  if (!response.ok) {
    const errorMsg = Object.entries(data)
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(' ') : v}`)
      .join(', ');
    throw new Error(errorMsg || 'Failed to create product');
  }
  return data;
}

export async function updateProduct(id, formData) {
  const response = await fetch(`${API_BASE_URL}/products/${id}/`, {
    method: 'PUT',
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) {
    const errorMsg = Object.entries(data)
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(' ') : v}`)
      .join(', ');
    throw new Error(errorMsg || 'Failed to update product');
  }
  return data;
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_BASE_URL}/products/${id}/`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
  return response.json();
}

