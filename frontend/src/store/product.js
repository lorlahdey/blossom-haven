import { create } from "zustand";

const getToken = () => {
  const storedData = localStorage.getItem("auth-storage");  
  if (!storedData) return null; // If no data, return null

  try {
    const parsedData = JSON.parse(storedData); // Parse JSON data
    return parsedData.state.token; // Return the actual token
  } catch (error) {
    return null;
  }
};


export const useProductStore = create((set) => ({
    products: [],
    setProducts: (products) => set({ products }),
    createProduct: async (newProduct) => {
        if (!newProduct.name || !newProduct.image || !newProduct.price) {
			return {error:true, success: false, message: "Please fill in all fields." };
        }
		
		const token = getToken();

		if (!token) {
			return {
				error: true,
				success: false,
				message: "Authentication required. Please log in again.",
			};
		}
		
        const res = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newProduct),
        });
        const data = await res.json();
        set((state) => ({ products: [...state.products, data.data] }));
        return {error:false, success: true, message: "Product created successfully" };
    },
    fetchProducts: async () => {
		const res = await fetch("/api/products");
		const data = await res.json();
		set({ products: data.data });
	},
    deleteProduct: async (pid) => {
		const token = getToken();

		if (!token) {
			return {
				error: true,
				success: false,
				message: "Authentication required. Please log in again.",
			};
		}
		const res = await fetch(`/api/products/${pid}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		const data = await res.json();
		if (!data.success) return {error:true, success: false, message: data.message };

		// update the ui immediately, without needing a refresh
		set((state) => ({ products: state.products.filter((product) => product._id !== pid) }));
		return {error:false, success: true, message: data.message };
	},
	updateProduct: async (pid, updatedProduct) => {
		const token = getToken();

		if (!token) {
			return {
				error: true,
				success: false,
				message: "Authentication required. Please log in again.",
			};
		}

		const res = await fetch(`/api/products/${pid}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(updatedProduct),
		});
		const data = await res.json();
		if (!data.success) return { error:true, success: false, message: data.message };

		// update the ui immediately, without needing a refresh
		set((state) => ({
			products: state.products.map((product) => (product._id === pid ? data.data : product)),
		}));

		return {error:false, success: true, message: data.message };
	},
}));