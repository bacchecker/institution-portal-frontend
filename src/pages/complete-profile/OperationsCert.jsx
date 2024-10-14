import React, { Component } from 'react';
import toast from 'react-hot-toast';
import Textbox from '../../components/Textbox'
import Spinner from '../../components/Spinner';
import { FaAnglesRight } from 'react-icons/fa6';
import axios from '../../axiosConfig'

class OperationsCert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      previewPDF: null,
      previewImage: null,
      isPDF: false,
      numPages: null,
      pageNumber: 1,
      error: null,
      certificate_name: '',
      certificate_file: null,
      isSaving: false
    };
    this.fileInputRef = React.createRef();
  }

  handleImageClick = () => {
    this.fileInputRef.current.click();
  };

  handleFileChange = (e) => {
    const file = e.target.files[0];
    const fileType = file.type;

    if (fileType === 'application/pdf' || fileType.startsWith('image/')) {
        
        if (fileType.startsWith('image/')) {
            const imageUrl = URL.createObjectURL(file);
            this.setState({ previewPDF: null, previewImage: imageUrl, selectedFile: file });
        }
        else if (fileType === 'application/pdf') {
          const pdfUrl = URL.createObjectURL(file);
          this.setState({ previewPDF: pdfUrl, previewImage: null, selectedFile: file });
        }
    } else {
        
        toast.error("Only PNG, JPG, JPEG, and PDF files are allowed.");
        this.setState({ selectedFile: null });
    }
  };

  handleInputChange = (e) => {
    this.setState({ certificate_name: e.target.value });
  };

  componentDidMount() {
    this.fetchInstitutionCertificate();
  }

  fetchInstitutionCertificate = async () => {
    try {
      const response = await axios.get('/institution/institution-certificates');
      const certificateData = response.data.certificateData;
  
      if (certificateData) {
        // Check if the certificate file exists
        let previewImage = null;
        let previewPDF = null;
  
        // Check if the file is an image or a PDF
        const certificateFileUrl = `${import.meta.env.VITE_BASE_URL}/storage/app/public/${certificateData.certificate_file}`;
        const fileType = certificateFileUrl.split('.').pop().toLowerCase();
  
        if (fileType === 'pdf') {
          previewPDF = certificateFileUrl;
        } else if (['png', 'jpg', 'jpeg'].includes(fileType)) {
          previewImage = certificateFileUrl;
        }
  
        this.setState({
          certificate_name: certificateData.certificate_name,
          certificate_file: certificateData.certificate_file,
          previewImage: previewImage,
          previewPDF: previewPDF,
          certificateFileFile: null,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch institution certificate');
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({isSaving: true})

    const formData = {
        certificate_name: this.state.certificate_name,
        certificate_file: this.state.selectedFile,
    };

    try {
        const response = await axios.post('/institution/institution-certificates', formData);
        toast.success(response.data.message);
        this.setState({isSaving: false})
    } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred. Please try again.");
        this.setState({isSaving: false})
    }
  };


  render() {
    const { selectedFile, previewImage, previewPDF, error, isSaving } = this.state;

    return (
      <div className="bg-white rounded-md px-2 py-8">
        <form onSubmit={this.handleSubmit} className="w-full flex flex-col items-center">
          <Textbox
            className="w-4/5 mb-4"
            label="Operations Certificate Name"
            name="certificate_name"
            value={this.state.certificate_name}
            onChange={this.handleInputChange}
          />
          <div className="w-full flex flex-col items-center">
            <div
              className="relative cursor-pointer bg-gray-100 rounded-lg border border-gray-300 min-h-[400px] max-h-[500px] w-4/5 flex flex-col justify-center items-center overflow-auto" // Added overflow-auto
              onClick={this.handleImageClick}
            >
              {!previewImage && !previewPDF && (
                <div className="text-center text-gray-600">
                  <p>Click to upload certificate</p>
                </div>
              )}

              {/* Image preview */}
              {previewImage && (
                <div className="flex justify-center items-center w-full h-[500px] overflow-auto"> {/* Set a fixed height for image container */}
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="object-contain" // This keeps the aspect ratio
                    style={{ maxHeight: '100%', maxWidth: '100%' }} // Ensure the image does not exceed container
                  />
                </div>
              )}

              {/* PDF preview */}
              {previewPDF && (
                <div
                    className='object-contain h-full'
                >
                    <object
                  data={previewPDF}
                  type="application/pdf"
                  height="400px"
                  width="750px" // Adjust height as needed
                  className="border border-gray-300"
                >
                  <p>Your browser does not support PDFs. 
                    <a href={previewPDF}>Download the PDF</a>.
                  </p>
                </object>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg, application/pdf"
              ref={this.fileInputRef}
              onChange={this.handleFileChange}
              className="hidden"
              name='certificate_file'
            />

            <div className="mt-2 text-sm text-gray-600">
              {selectedFile ? selectedFile.name : 'No file chosen'}
            </div>

            {/* Show error message if the file type is not supported */}
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </div>
          <div className="w-full flex justify-end">
            <button
              type="submit"
              className={`flex items-center bg-green-700 hover:bg-green-600 text-white px-4 py-1.5 rounded-md font-medium ${
                isSaving ? 'cursor-not-allowed bg-gray-400' : ''
              }`}
              disabled={isSaving} 
            >
              {isSaving ? (
                <>
                  <Spinner size="w-5 h-5"/> 
                  <span className="ml-2">Saving...</span>
                </>
              ) : (
                <>
                  Save and Continue
                  <FaAnglesRight className="ml-2" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      
    );
  }
}

export default OperationsCert;
