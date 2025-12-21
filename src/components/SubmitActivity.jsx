import { useState } from "react";
import ActivityForm from "./ActivityForm";
import RequestInfo from "./RequestInfo";

// export default function SubmitActivity({ hidden, setHidden, overlayRequest }) {
//   if (hidden) {
//     return null;
//   }
//   return (
{/* <div className=" overlay absolute w-dvw h-dvh bg-slate-800/20 top-0 flex justify-center items-center">
  <section className="relative activity-section flex flex-col mx-10 items-center bg-white w-dvw h-130 max-w-5xl rounded-md">
    <h2 className="text-stone-900 text-2xl text-center pt-8">
      Create Activity
    </h2>
    <button
      onClick={() => setHidden(!hidden)}
      className="absolute right-2 top-3 fa-solid fa-circle-xmark exit-button"
    ></button>
  </section>
</div>;
//   );
// } */}

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SubmitActivity({request}) {

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button>Create</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>Create Activity</DialogTitle>
            <DialogDescription>
              Create an activity for a technician here. Click Submit when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="main-overlay-content mx-10 gap-10 flex justify-center items-center">
            <RequestInfo request={request} />
            <ActivityForm />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
