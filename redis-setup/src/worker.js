const { Worker } = require("bullmq");

const  emailWorker = new Worker(
    "emails",
   async(job)=>{
    console.log("Processing email Job..", job.id,job.name,job.data );
    (await new Promise((resolved)=>setTimeout(resolved,1500))),
    console.log("email job completed ",job.id,job.name,job.data);
   },
   {connection}

)
worker.on("completed",(job)=>{
    console.log("Job completed with result ", job.returnvalue);
})
worker.on("failed",(job,err)=>{
    console.log("Job failed with error ", err);
})