'use client'

import {
  ArrowDownIcon,
  CloudIcon,
  DocumentArrowUpIcon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from './ui/Button'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { TrashIcon } from '@heroicons/react/24/solid'
import FormButton from './ui/FormButton'
import { createDataset } from '@/server-actions/dataset-actions'
import { toast } from 'sonner'

export default function UploadInput() {
  const [file, setFile] = useState<File>()
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      maxFiles: 1,
      accept: {
        'application/pdf': ['.pdf'],
        'text/plain': ['.txt'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          ['.docx'],
      },
      onDrop: async (acceptedFiles: File[]) => {
        setFile(acceptedFiles[0])
      },
    })

  return (
    <form
      action={async (formData) => {
        const error = await createDataset(formData)
        if (error) {
          toast.error('Something went wrong')
        } else {
          toast.success('You source is ready!')
        }
      }}
    >
      <div className="grid grid-cols-4 gap-6">
        <div
          className={`relative h-[16rem] w-full cursor-pointer overflow-hidden rounded-lg transition duration-150 bg-white col-span-3`}
        >
          <div
            {...getRootProps()}
            className="group relative z-30 h-full w-full overflow-hidden"
          >
            <input name="file" {...getInputProps()} maxLength={1} />
            {isDragActive && (
              <div className="flex h-full w-full cursor-pointer flex-col items-center justify-center space-y-2 rounded-lg border border-dashed border-indigo-500 text-center">
                <ArrowDownIcon className="text-secondary h-8 w-8" />
                <div className="flex items-center space-x-2">
                  <h3 className="cursor-pointer text-sm font-semibold transition duration-150 group-hover:text-indigo-500">
                    Drop your file here
                  </h3>
                </div>
                <p className="text-secondary text-xs">
                  Supported File Types: .pdf, .docx, .txt
                </p>
              </div>
            )}
            {!isDragActive && (
              <div className="relative flex h-full w-full cursor-pointer flex-col items-center justify-center space-y-2 overflow-hidden rounded-lg border border-dashed border-zinc-400 text-center">
                <CloudIcon className="text-secondary h-8 w-8" />
                <div className="flex items-center space-x-2">
                  <h3 className="cursor-pointer text-sm font-semibold underline transition duration-150">
                    Click to upload
                  </h3>
                  <h3 className="text-sm">or Drag & Drop</h3>
                </div>
                <p className="text-secondary text-xs">
                  Supported File Types: .pdf, .docx, .txt
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-zinc-200 p-6 flex flex-col">
          {file ? (
            <div className="flex flex-col space-y-4">
              <h3 className="text-sm font-semibold">{file.name}</h3>
              <div className="flex items-center space-x-4">
                <p className="text-xs font-medium">Type:</p>
                <p className="text-xs font-medium">{file.type}</p>
              </div>
              <div className="flex items-center space-x-4">
                <p className="text-xs font-medium">Size:</p>
                <p className="text-xs font-medium">
                  {(file.size / (1024 * 1024)).toFixed(2)}MB
                </p>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-sm font-semibold">Selected Files</h3>
            </div>
          )}
          <div className="flex items-center space-x-2 mt-auto">
            <FormButton
              pendingText="Processing..."
              disabled={!file}
              className="w-full"
            >
              Upload file
            </FormButton>
            <Button
              onClick={() => setFile(undefined)}
              size="icon"
              variant="outline"
              className="min-w-[2.5rem]"
            >
              <TrashIcon className="h-4 w-4 text-rose-500" />
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}