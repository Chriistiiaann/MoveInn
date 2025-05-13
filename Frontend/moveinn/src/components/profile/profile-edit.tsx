"use client";

import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { type UserUpdateFormData, SOCIAL_MEDIA_TYPES } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Check,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";
import { useAuth } from "@/context/authcontext";
import { API_BASE_IMAGE_URL } from "@/utils/endpoints/config";
import { CountrySearch, CitySearch } from "@/components/ui/country-city-search";

interface ProfileEditProps {
  onSuccess: () => void;
}


const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  biography: z.string().optional(),
  school: z.string().optional(),
  city: z.string().optional(),
  degree: z.string().optional(),
  nationality: z.string().optional(),
  erasmusCountry: z.string().optional(),
  erasmusDate: z.string().nullable().optional(),
  phone: z.string().optional(),
  avatarFile: z.any().optional(),
  socialMedias: z.array(
    z.object({
      id: z.number(),
      socialMedia: z.number(),
      url: z.string().url("Invalid URL"),
    })
  ),
  countryFlag: z.string().optional(),
  erasmusCountryFlag: z.string().optional(),
});

export function ProfileEdit({ onSuccess }: ProfileEditProps) {
  const { user, updateUserProfile, updateSocialMedia } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedCountryFlag, setSelectedCountryFlag] = useState<string | null>(
    null
  );
  const [selectedErasmusCountryFlag, setSelectedErasmusCountryFlag] = useState<
    string | null
  >(null);

  function getFormattedErasmusDate(daysInCountry: number): string {
    const date = new Date();
    date.setDate(date.getDate() - daysInCountry);
    return date.toISOString().split("T")[0]; 
  }
  

  const defaultValues = {
    name: user?.name || "",
    lastName: user?.lastName || "",
    email: user?.mail || "",
    biography: user?.biography || "",
    school: user?.school || "",
    city: user?.city || "",
    degree: user?.degree || "",
    nationality: user?.nationality || "",
    erasmusCountry: user?.erasmusCountry || "",
    erasmusDate: user?.erasmusDate ? getFormattedErasmusDate(user.erasmusDate) : "",
    phone: user?.phone || "",
    socialMedias: user?.socialMedias || [],
    countryFlag: user?.countryFlag || "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    form.setValue("avatarFile", file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const addSocialMedia = () => {
    const currentSocialMedias = form.getValues("socialMedias") || [];
    const newId =
      currentSocialMedias.length > 0
        ? Math.max(...currentSocialMedias.map((s) => s.id)) + 1
        : 1;

    form.setValue("socialMedias", [
      ...currentSocialMedias,
      { id: newId, socialMedia: 1, url: "" },
    ]);
  };

  const removeSocialMedia = (id: number) => {
    const currentSocialMedias = form.getValues("socialMedias");
    form.setValue(
      "socialMedias",
      currentSocialMedias.filter((s) => s.id !== id)
    );
  };

  const handleCountryFlagChange = (flagUrl: string) => {
    setSelectedCountryFlag(flagUrl);
    form.setValue("countryFlag", flagUrl);
  };

  const handleErasmusCountryFlagChange = (flagUrl: string) => {
    setSelectedErasmusCountryFlag(flagUrl);
    form.setValue("erasmusCountryFlag", flagUrl);
    // Reset city when country changes
    form.setValue("city", "");
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      const formData: UserUpdateFormData = {
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        biography: data.biography || "",
        school: data.school || "",
        city: data.city || "",
        degree: data.degree || "",
        nationality: data.nationality || "",
        erasmusCountry: data.erasmusCountry || "",
        erasmusDate: user?.erasmusDate
        ? getFormattedErasmusDate(user.erasmusDate)
        : "",      
        phone: data.phone || "",
        avatarFile: data.avatarFile,
        countryFlag: data.countryFlag,
        erasmusCountryFlag: data.erasmusCountryFlag,
        socialMedias: [],
      };

      await updateUserProfile(formData);

      if (data.socialMedias && data.socialMedias.length > 0) {
        await updateSocialMedia(data.socialMedias);
      } else {
        await updateSocialMedia([]);
      }

      setSuccess("Profile updated successfully");

      // Notify success
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Could not update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const userAvatar = user?.avatarUrl
    ? API_BASE_IMAGE_URL + user.avatarUrl
    : "/placeholder.svg?height=128&width=128";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Error/success messages */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Avatar upload */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-primary">
            <Image
              src={avatarPreview || userAvatar}
              alt="Avatar"
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="avatar-upload" className="cursor-pointer">
              <div className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/70 transition-colors">
                <Upload className="h-4 w-4" />
                <span>Change photo</span>
              </div>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500">Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your name"
                    {...field}
                    className="text-text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500">Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your last name"
                    {...field}
                    className="text-text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-500">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="your@email.com"
                  {...field}
                  className="text-text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="biography"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-500">Biography</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about yourself..."
                  className="resize-none min-h-[100px] text-text"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Academic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="school"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500">University</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your university"
                    {...field}
                    className="text-text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="degree"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500">Degree</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your degree or specialty"
                    {...field}
                    className="text-text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nationality"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500">Nationality</FormLabel>
                <FormControl>
                  <CountrySearch
                    value={field.value || ""}
                    onChange={field.onChange}
                    onFlagChange={handleCountryFlagChange}
                    placeholder="Search for your nationality..."
                    className="text-text placeholder:text-text-secondary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500">Phone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your phone number"
                    {...field}
                    className="text-text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Erasmus Information */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold text-text-secondary">
            Erasmus Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="erasmusDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-500">Erasmus Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value || ""}
                      className="text-text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="erasmusCountry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-500">
                    Erasmus Country
                  </FormLabel>
                  <FormControl>
                    <CountrySearch
                      value={field.value || ""}
                      onChange={field.onChange}
                      onFlagChange={handleErasmusCountryFlagChange}
                      placeholder="Search for erasmus country..."
                      className="text-text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-500">Erasmus City</FormLabel>
                  <FormControl>
                    <CitySearch
                      value={field.value || ""}
                      onChange={field.onChange}
                      country={form.watch("erasmusCountry") || ""}
                      disabled={!form.watch("erasmusCountry")}
                      placeholder="Search for erasmus city..."
                      className="text-text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Social Media */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-text-secondary">
              Social Media
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSocialMedia}
              className="flex items-center gap-1 bg-secondary/50 text-primary-dark hover:bg-secondary"
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </Button>
          </div>

          {form.watch("socialMedias").map((social, index) => (
            <div
              key={`social-form-${social.id}-${index}`}
              className="flex items-start gap-3 text-primary-dark"
            >
              <FormField
                control={form.control}
                name={`socialMedias.${index}.socialMedia`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-gray-500">
                      Social Media
                    </FormLabel>
                    <Select
                      value={field.value.toString()}
                      onValueChange={(value) =>
                        field.onChange(Number.parseInt(value))
                      }
                    >
                      <FormControl>
                        <SelectTrigger className="text-primary-dark">
                          <SelectValue placeholder="Select a social media" className="text-primary-dark" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white text-primary-dark">
                        {Object.entries(SOCIAL_MEDIA_TYPES).map(
                          ([id, name]) => (
                            <SelectItem key={`social-type-${id}`} value={id}>
                              {name}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`socialMedias.${index}.url`}
                render={({ field }) => (
                  <FormItem className="flex-[2]">
                    <FormLabel className="text-gray-500">URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://..."
                        {...field}
                        className="text-text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-8"
                onClick={() => removeSocialMedia(social.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
            disabled={isSubmitting}
            className="text-gray-800 bg-red-400 hover:bg-red-500"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
