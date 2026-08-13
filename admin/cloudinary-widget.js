export default {
  name: 'cloudinary',
  props: ['value', 'options', 'onChange', 'onFocus', 'onBlur', 'field'],
  
  data() {
    return {
      uploading: false,
      uploadProgress: 0,
      error: null,
      dragActive: false
    }
  },
  
  computed: {
    images() {
      return Array.isArray(this.value) ? this.value : []
    },
    maxFiles() {
      return this.options?.max || 20
    },
    cloudName() {
      return this.options?.cloud_name || 'k3pbhkqi'
    },
    uploadPreset() {
      return this.options?.upload_preset || 'xam_products'
    }
  },
  
  methods: {
    async uploadFiles(files) {
      const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'))
      if (validFiles.length === 0) return
      
      // Verificar límite
      const totalAfterUpload = this.images.length + validFiles.length
      if (totalAfterUpload > this.maxFiles) {
        this.error = `Máximo ${this.maxFiles} imágenes permitidas`
        return
      }
      
      this.uploading = true
      this.error = null
      
      try {
        const uploadPromises = validFiles.map(async (file) => {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('upload_preset', this.uploadPreset)
          
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
            { method: 'POST', body: formData }
          )
          
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error?.message || 'Error al subir')
          }
          
          const data = await response.json()
          return data.secure_url
        })
        
        const urls = await Promise.all(uploadPromises)
        const newValue = [...this.images, ...urls]
        this.onChange(newValue)
        
      } catch (err) {
        this.error = err.message
      } finally {
        this.uploading = false
        this.uploadProgress = 0
      }
    },
    
    handleFileInput(event) {
      this.uploadFiles(event.target.files)
      event.target.value = ''
    },
    
    handleDrop(event) {
      event.preventDefault()
      this.dragActive = false
      if (event.dataTransfer?.files) {
        this.uploadFiles(event.dataTransfer.files)
      }
    },
    
    handleDragOver(event) {
      event.preventDefault()
      this.dragActive = true
    },
    
    handleDragLeave(event) {
      event.preventDefault()
      this.dragActive = false
    },
    
    removeImage(index) {
      const newValue = this.images.filter((_, i) => i !== index)
      this.onChange(newValue)
    },
    
    optimizeUrl(url) {
      if (!url) return url
      if (url.includes('/f_auto,q_auto/')) return url
      return url.replace('/image/upload/', '/image/upload/f_auto,q_auto/')
    }
  },
  
  template: `
    <div class="cloudinary-widget">
      <!-- Input oculto -->
      <input
        type="file"
        accept="image/*"
        multiple
        @change="handleFileInput"
        ref="fileInput"
        :disabled="uploading"
        style="display: none"
      />
      
      <!-- Dropzone -->
      <div
        class="dropzone"
        :class="{ active: dragActive, uploading: uploading }"
        @dragover="handleDragOver"
        @dragenter="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
        @click="$refs.fileInput.click()"
      >
        <div class="dropzone-content">
          <span class="icon">📷</span>
          <span class="title">Arrastra tus imágenes aquí</span>
          <span class="subtitle">o haz click para seleccionar</span>
          <span v-if="uploading" class="progress">
            Subiendo... {{ uploadProgress }}%
          </span>
        </div>
      </div>
      
      <!-- Error -->
      <div v-if="error" class="error">{{ error }}</div>
      
      <!-- Contador -->
      <div v-if="images.length > 0" class="counter">
        {{ images.length }} / {{ maxFiles }} imágenes
      </div>
      
      <!-- Lista de imágenes -->
      <div class="image-list">
        <div v-for="(url, index) in images" :key="index" class="image-item">
          <img :src="optimizeUrl(url)" :alt="'Imagen ' + (index + 1)" />
          <button @click="removeImage(index)" class="remove-btn" type="button">✕</button>
        </div>
      </div>
    </div>
  `
}